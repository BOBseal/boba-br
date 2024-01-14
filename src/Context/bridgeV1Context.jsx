"use client";
import { 
    connectContract ,
    switchNetwork ,
    addNetwork,
    getCurrentChainId,
    connectMetamask

} from '../utils/contextProviders/helpers';
import {
    configData,
    bridgeV1Abi

} from '../utils/constants/index';

import { hexToNumber , hexToString , hexToBigInt , hexToBytes } from 'viem';
import ethers from 'ethers';
import React,{ useState, useEffect } from 'react';

export const BridgeV1Context = React.createContext();
export const BridgeV1Provider = ({children})=>{
    const [user , setUser] = useState({
        address:"",
        currentChain:"",
        userAddresses:[],
        userBridges: [],
        isOGUser : false,
        referalData: [],
        userPoints: 0,
        totalBridgeIn: 0,
        totalBridgeOut: 0,
        totalReferals:0
    });

    const [bridgeParams , setBridgeParams] = useState({
        type:"NATIVE",
        amountTo : '',
        amountFrom:'',
        userBalance : "",
        selectedSrc :'',
        selectedDest :"",
        action:"",
        amountToRecieve:""
    });

    const connectWallet = async() =>{
        try {
            if(window.ethereum){
                const wallets = await connectMetamask();
                if(wallets[0]){
                    setUser({...user, address: wallets[0], userAddresses: wallets});
                    return wallets;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    //dest chain id and ether to send
    const quoteCost = async(chainId , amount) => {
        try {
            if(window.ethereum) {
                if(!user.address) {
                    alert("Connect Metamask First")
                    return;
                }
                const userChainId = getCurrentChainId();
                let contractAdr, gasUnits, fObj, wormId;
                fObj = Object.entries(configData).filter(([key]) => key === userChainId.hex)
                let fObj2 = Object.entries(configData).filter(([key]) => key === chainId);
                if(fObj){
                    contractAdr = fObj.address;
                } 
                if(fObj2){
                    gasUnits = fObj2.metadata.gasUnits;
                    wormId = fObj2.wormholeId;
                }
                if(contractAdr) {
                    const contract = await connectContract(contractAdr, user.address);
                    const quotation =await contract.quoteCrossChainDeposit(wormId , amount , gasUnits);
                    return {quote: quotation, obj: fObj, contractObj:contract , dObj: fObj2, gas:gasUnits};
                } else return "Contract Address Not Given";
            } else return "NO Injected Provider Detected";
        } catch (error) {
            console.log(error)
        }
    }
    // return user bridge data for all chains ===> amount in bigInt
    const getUserBridgeData = async() => {
        try {
            if(window.ethereum){
                if(!user.address) {
                    alert("Connect Metamask First")
                    return;
                }
                const userChainId = getCurrentChainId();
                let contractAdr, gasUnits , bridgeHashes =[] , ch = userChainId;
                    configData.forEach(async(element) => {
                        contractAdr = element.address
                        const contract = await connectContract(contractAdr, user.address);
                        ch = element.wormholeId;
                        const noncesData = await contract.getUserData(user.address);
                        const p = hexToNumber(noncesData[2]);
                        //const r = hexToNumber(noncesData[3]);
                        setUser({...user, userPoints: user.userPoints + p});
                        const bridgeInNonces = noncesData ? hexToNumber(noncesData[0]) : 0;
                        for(let x = 0 ; x < bridgeInNonces; x++){
                            const bridgeHash = await contract.getUserBridgeHashes(user.address , x , ch);
                            const bridges = await contract.getUserBridges(user.address, bridgeHash);
                            const type = hexToNumber(bridges[1]) == 0 ? "Native" : "ERC20";
                            bridgeHashes.push({
                                hash : bridgeHash ,
                                fromChain: hexToNumber(bridges[0]),
                                sendType : type,
                                address: bridges[2],
                                amount: bridges[3],
                                isClaimed : bridges[4]
                            });
                        }
                    });
                setUser({...user , userBridges: bridgeHashes})
                return bridgeHashes;
            }
        } catch (error) {
            console.log(error.msg)
        }
    }

    const bridgeEther = async(amount ,toChainId, referal) =>{
        try {
            if(window.ethereum){
                if(!user.address) {
                    alert("Connect Metamask First")
                    return;
                }
                //const _chainId = await getCurrentChainId();
                const customObj = await quoteCost(toChainId, amount);
                const contract = customObj.contractObj;
                const srcConfig = customObj.obj;
                const cost = customObj.quote;
                const wormHoleId = customObj.dObj.wormHoleId
                const bridge = await contract.bridgeEther(wormHoleId ,customObj.dObj.address, user.address , amount, customObj.gas, referal, {value:cost});
                return bridge
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(!user.address) {
            connectWallet();
        }
        if(user.address) {
            getUserBridgeData();
        }
    }, [user.address])
    

    return (
        <BridgeV1Context.Provider value={{
            quoteCost,getUserBridgeData, bridgeEther, connectWallet, user , bridgeParams , setBridgeParams
        }}>
        {children}
        </BridgeV1Context.Provider>
    )
}