// SPDX-License-Identifier: NONE 

/*
IMPORTANT
--Properitary Software -- Do Not Distribute or Legal Action will be taken on--

BUILT SPECIFICALLY FOR PARTNERSHIP BETWEEN GRAYZONE AND BRIDGE PROTOCOL
--- Further mantainence and upgrades to the system manage by GRAYZONE 

V1 Specs : Native and ERC20 Bridge to EVMs 
         : Affiliate system with 20% bridge revenue share from refered accounts
         : Auto Distribution of Grayzone's Share to Grayzone's Treasury

IMPORTANT---
Post Deployment allow all endpoins for all instances to recieve bridges from
*/
pragma solidity ^0.8.17;

import "./src/Utils.sol";
import {IWETH} from "./src/interfaces/IWETH.sol";
import {TokenBase, TokenReceiver, TokenSender} from "./src/TokenBase.sol";
import "./src/interfaces/IWormholeReceiver.sol";
import "./src/interfaces/IWormholeRelayer.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // use oz < 5.0

contract BridgeV1 is TokenSender , TokenReceiver, Ownable{
    
    uint256 public fee = 0.001 ether; // dst chain fee
    uint256 public fMultiplier = 5; // default 0.5%
    address public solutionsProviderAddress; // Partner Address
    uint256 public solutionsProviderShare = 19; // 19% of fee generated
    uint256 public totalPoints; // total points gathered by all addresses

    bool public bridgeActive = true; // state to control if bridging is allowed

    struct USER {
        uint256 nonces;
        uint256 sendNonces;
        uint256 points; // this points represent the point per tx , volume based calculations must be done to add to this variable for end points
        uint256 totalReferals;
        mapping(uint256 => address) _referals; // count to address
        mapping(bytes32=> Bridges) bridges;
        mapping(uint256=>mapping(uint16 =>bytes32)) hashes;
    }

    struct Referals{
        bool refered;
        address referer;
    }

    struct Bridges {
        uint16 fromChain;
        uint8 sendType;
        address token;
        uint256 amount;
        bool claimed;
    }

    mapping(address => mapping(address => uint256)) public totalUserVolume; // used for point calculation mechanism on extension contracts
    mapping(address => Referals) internal referals; // to check if user has beed refered already
    mapping(address => uint256 ) public feesTotal; // contract/protocol fee
    mapping(address => USER) internal userData; // userData
    mapping(uint16 => mapping(address => bool)) public endpoints;

    constructor(
        address _wormholeRelayer, // wormhole relayer address
        address _tokenBridge, // wormhole token bridge address
        address _wormhole, // wormhole core address
        address grayzoneAddress // partnership % sharing address
    
    ) TokenBase(_wormholeRelayer, _tokenBridge, _wormhole) {
        solutionsProviderAddress = grayzoneAddress;
    }
    // returns [user bridge in nonces, bridge Out Nonces , user points, user total referals]
    function getUserData(address user) public view returns (uint256 , uint256, uint256, uint256){
        return (userData[user].nonces,userData[user].sendNonces , userData[user].points,userData[user].totalReferals);
    }
    // returns user's refered addresses
    function getUserReferals(address user , uint nonce) public view returns(address){
        return (userData[user]._referals[nonce]);
    }
    // returns if a user is under referal or og
    function getUserReferalStat(address user) public view returns(Referals memory){
        return referals[user];
    }
    // returns hash of bridges for nonces and chain id
    function getUserBridgeHashes(address user, uint256 nonce, uint16 chainId)public view returns(bytes32){
        return userData[user].hashes[nonce][chainId];
    }
    // returns bridge data for hash for user
    function getUserBridges(address user ,bytes32 hash) public view returns(Bridges memory){
        return userData[user].bridges[hash];
    }
    
    // get bridge fee quotations (amount eth need to send along bridgeFunctions) -- keep amount == 0 for erc20 transfers , amount = ether/native to send to dest for eth bridges + fee needed 
    // Returns total eth needed to send to function

    function quoteCrossChainDeposit(
        uint16 targetChain,
        uint256 amt ,
        uint256 gasUnits
    ) public view returns (uint256 cost, uint256 f) {
        uint256 deliveryCost;
        f = fee;
        (deliveryCost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            amt,
            gasUnits
        );
        // Total cost: delivery cost + cost of publishing the 'sending token' wormhole message
        cost = deliveryCost + wormhole.messageFee() + f;
    }
    //function to set allowed enpoints of bridge , only allow data from those contracts 

    function setAllowedEndpoint (uint16 chainId , address bridgeContract) public onlyOwner{
        endpoints[chainId][bridgeContract] = true;
    }
    //claim failed 
    function claimFailedBridge(bytes32 deliveryhash) public {
        Bridges memory bridge = userData[msg.sender].bridges[deliveryhash];
        bool cl; uint256 amt ; address tkn;
        cl = bridge.claimed;
        amt = bridge.amount;
        tkn = bridge.token;
        if(bridge.sendType == uint8(0) && amt > 0 && cl == false){
            payable(msg.sender).transfer(amt);
        }
        if(bridge.sendType == uint8(1)&&amt > 0 && cl == false){
           IERC20(tkn).transfer(msg.sender , amt);
        }
    }

    // bridge revenue withdrawal
    function withdrawRevenue(address token , uint256 amt, address to) public onlyOwner{
        require(feesTotal[token]>= amt,"enter correct val");
        feesTotal[token] = feesTotal[token] - amt;
        if(token == address(0)){
            payable(to).transfer(amt);
        }
        else { 
            IERC20(token).transfer(to , amt);
        }
    }
    // base fee for bridges 
    function changeBaseFee(uint256 wEi) public onlyOwner {
        fee = wEi;
    }
    // % based fee on bridged amount
    function changePercentFee(uint256 fMultiplier_) public onlyOwner{
        require(fMultiplier_ < 101,"cannot exceed 10%");
        fMultiplier = fMultiplier_;
    }

    // bridge erc20 -- ref == address(0) in case of a non-reffered user
    function bridgeErc20(
        uint16 targetChain,
        address targetBridge,
        address recipient,
        uint256 amount,
        address token,
        uint256 dstGas,
        address ref
    ) public payable {
        (uint256 cost, uint256 f) = quoteCrossChainDeposit(targetChain, 0, dstGas);
        require(
            msg.value == cost,
            "msg.value must be == quoteCrossChainDeposit(targetChain)"
        );
        bool x = IERC20(token).transferFrom(msg.sender, address(this), amount);
        require(x ,"failed");
        //handle provider distribution
        (f,)= _processPartner(f);
        bytes memory payload = abi.encode(recipient, uint8(1) , 0);
        sendTokenWithPayloadToEvm(
            targetChain,
            targetBridge, // address (on targetChain) to send token and payload to
            payload,
            0,
            dstGas, // gas units
            token, // address of IERC20 token contract
            amount // amount
        );
        totalUserVolume[msg.sender][token] = totalUserVolume[msg.sender][token] + amount;
        //handle referals
        _handleRef(msg.sender , ref);
        //handle points
        _processPoints(msg.sender, ref);
        userData[msg.sender].sendNonces = userData[msg.sender].sendNonces + 1;
        feesTotal[address(0)] =feesTotal[address(0)] + f;
    }

    // bridge native
    function bridgeEther(
        uint16 targetChain,
        address targetBridge,
        address recipient,
        uint256 amount
        ,uint256 dstGas,
        address ref 
    ) public payable {
        (uint256 cost, uint256 f) = quoteCrossChainDeposit(targetChain, amount,dstGas);
        require(
            msg.value == cost,
            "amount must be == quoteCrossChainDeposit(targetChain)"
        );
        //handle provider distribution
        IWETH weth = tokenBridge.WETH();
        ( f,) = _processPartner(f);
        bytes memory payload = abi.encode(recipient ,uint8(0), amount);
        sendTokenWithPayloadToEvm(
            targetChain,
            targetBridge, // address (on targetChain) to send token and payload to
            payload, // data
            amount, // receiver value
            dstGas, // gas units
            address(weth), // address of IERC20 token contract
            0 // amount 0 as native send as gas drop
        );
        totalUserVolume[msg.sender][address(0)] = totalUserVolume[msg.sender][address(0)] + amount;
        _handleRef(msg.sender, ref);
        _processPoints(msg.sender,ref);
        userData[msg.sender].sendNonces = userData[msg.sender].sendNonces + 1;
        feesTotal[address(0)] =feesTotal[address(0)] + f;
    }

    // overrides and delivery Functions -- atleast 700_000 gas units for 7 mil unit limit chains needed for successful claims
    function receivePayloadAndTokens(
        bytes memory payload,
        TokenReceived[] memory receivedTokens,
        bytes32 srcA, // sourceAddress
        uint16 ch,
        bytes32 dh// deliveryHash
    ) internal override onlyWormholeRelayer {
        require(receivedTokens.length == 1);
        address bridge = fromWormholeFormat(srcA);
        require(endpoints[ch][bridge]== true); // checks is endpoint is allowed and tokens sent is not blank
        (
            address recipient,
            uint8 type_,
            uint256 amt
        ) = abi.decode(payload, (address, uint8 , uint256));

        require(userData[recipient].bridges[dh].claimed == false);
        address tokenAddress = receivedTokens[0].tokenAddress;
        uint256 userN = userData[recipient].nonces;
        // type handling for native and erc20
        if(type_ == uint8(0)) { 
            uint256 a_ = amt * fMultiplier/1000;// fee
            uint256 f_ = amt - a_; // d amt 
            Bridges memory br = Bridges({
                fromChain :ch,
                sendType : type_,
                token: tokenAddress,
                amount: f_,
                claimed: true
            });
            userData[recipient].bridges[dh]= br;
            userData[recipient].hashes[userN][ch] = dh;
            (bool success, ) = recipient.call{value: f_}(new bytes(0));

            if(!success){userData[recipient].bridges[dh].claimed = false;}
            
            feesTotal[address(0)] =feesTotal[address(0)] + a_;
            
        } else  if(type_ == uint8(1)){
            uint256 amount = receivedTokens[0].amount;
            uint256 f_=amount * fMultiplier/ 1000;
            uint256 a = amount - f_;
            Bridges memory br = Bridges({
                fromChain :ch,
                sendType : type_,
                token: tokenAddress,
                amount: a,
                claimed: true
            });
            userData[recipient].bridges[dh]= br;
            userData[recipient].hashes[userN][ch] = dh;
            bool x =IERC20(tokenAddress).transfer(recipient,a);
            if(!x){userData[recipient].bridges[dh].claimed = false;}
            feesTotal[tokenAddress] =feesTotal[tokenAddress] + f_;
        }
        userData[recipient].nonces = userN + 1; 
    }

    //only grayzone can set the address to which they recieve profit sharing 
    function setProfitShareAddr(address addr) public {
        require(msg.sender == solutionsProviderAddress,"Only Grayzone allowed to access this function");
        solutionsProviderAddress = addr;
    }
    //grayzone is free to change the % they recieve at any time , can only decrease from max 19%
    function setProfitSharePercent(uint256 multiplier) public {
        require(multiplier < 20 ,"Can only be max 19 %"); // < 20 means 19
        require(msg.sender == solutionsProviderAddress,"Only Grayzone allowed to access this function");
        solutionsProviderShare = multiplier;
    }

    //process points for referer and refered 
    function _processPoints(address refered , address referer) internal {
        userData[refered].points =userData[refered].points + 1 ;
        if(referer != address(0)){
            userData[referer].points =userData[referer].points + 1 ;
        }
        totalPoints ++;
    }

    // internal initialize function for first referals -- checks if the user is refered before and if user is a fresh user
    function _handleRef (address refered , address ref) internal {
        if(ref != address(0) && referals[refered].refered == false && userData[refered].sendNonces == 0){
            referals[refered].refered = true;
            referals[refered].referer = ref;
            uint f__ = userData[ref].totalReferals;
            userData[ref].totalReferals = f__+1;
            userData[ref]._referals[f__] = msg.sender; 
        }
    }
    // internal process function to handle partner shares 
    function _processPartner(uint256 f) internal returns(uint256 , uint256){
        uint256 rf = f * solutionsProviderShare / 100;
        payable(solutionsProviderAddress).transfer(rf);
        return(f - rf , rf);
    }
    // emergency function for user point data
    function setUserPoints(address user , uint256 p) public onlyOwner {
        userData[user].points = p;
    }
    // emergency function to withdraw tokens from failed bridges
    function unsafeWithdraw(address token , uint256 amt, bool isFee) public onlyOwner{
        require(bridgeActive == false,"Only allowed if bridge inactive for users");
        if(isFee == true){
            feesTotal[token] = feesTotal[token] - amt;
        }
        if(token == address(0)){
            payable(msg.sender).transfer(amt);
        }
        else { 
            IERC20(token).transfer(msg.sender , amt);
        }
    }
    // function to toggle bridge active status , bridge must be turned off to execute unsafe withdrawals
    function toggleState(bool state) public onlyOwner{
        bridgeActive = state;
    }
}
