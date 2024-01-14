"use client";

import { BigNumber, ethers } from 'ethers';
import React,{ useState, useEffect } from 'react';
//import { ThirdwebProvider } from '@thirdweb-dev/react';
import {
    changeNetworkToLineaTestnet,
    connectContract, 
    connectNFTContract , 
    connectStorageContract, 
    unixTimeToHumanReadable,
    connectTransferContract,
    connectMarketPlace,
    connectErc20,
    connectForm
} from "../utils/hooks"
import { hexToNumber , hexToString, numberToHex, stringToHex } from 'viem';
import { PassAddress } from '@/utils/constants';

export const DappAppContext = React.createContext();
export const DappAppProvider = ({children})=> {
    const lineaTestId = "0xe704";
    const [user , setUser] = useState({});
    const [account, setAccount] = useState([]);
    const [error , setError] = useState({
        error:{},
        errorMsg:""
    });
    const [userPass , setUserPass] = useState();
    const [userItems , setUserItems] = useState({});

    useEffect(() => {
        //const chainId = await window.ethereum.request({ method: "eth_chainId" });
        window.ethereum.on('chainChanged', (chainId) => window.location.reload());
        window.ethereum.on('accountsChanged', (account) => window.location.reload());

        connectWallet();
    }, [])
    
    const getChainId = async()=>{
        try {
            if(window.ethereum){
                const chainId = await window.ethereum.request({ method: "eth_chainId" });
                return chainId;
            }
            else return false;
        } catch (error) {
            
        }
    }
    const connectWallet=async()=>{
        try {
            if(window.ethereum){
                const chainId =await getChainId()
                const obj = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                await obj;
                if(obj){
                    const f4 = obj[0].slice(0,4);
                    const l4 = obj[0].slice(39,42);
                    setUser({...user ,network:chainId, wallet:obj[0] , allWallets:obj , str: "User: 0x..."+l4});
                    setAccount(obj);
                    return obj[0];
                }
                return false;
            }
            else setError({error: {code :"0x" , msg:"failed"} , errorMsg:"PLEASE INSTALL METAMASK"})
        } catch (error) {
            setError({error: error,errorMsg: "Connect to Metamask Failed"});
        }
    }

    const mint=async()=>{
        try {
            if(user.wallet){
            const contract = await connectContract(user.wallet);
            const m = await contract.Claim();
            await m;
            console.log(m);
            return m;
            //console.log(m);
            }
        } catch (error) {
            console.log(
                error
            )
        }
    }

    const _addToStorage=async(id,uri, data)=>{
        try {
            if(user.wallet){
                const c = await connectStorageContract(user.wallet);
                const tx =  await c.addToStore(id , uri , data);
                return tx
            }
            return;
        } catch (error) {
            console.log(error);
        }
    }
    

    const _delStorage=async(id , slot)=>{
        try{    
            if(user.wallet){
                const c = await connectStorageContract(user.wallet);
                const tx =  await c.deleteSlot(id , slot);
                return tx
            }
            return;
        } catch (error) {
            console.log(error);
        }
    }

    const getStorage = async(id, slot)=>{
        try{    
            if(user.wallet){
                const c = await connectStorageContract(user.wallet);
                const tx =  await c.getStorage(user.wallet , id , slot);
                return tx
            }
            return;
        } catch (error) {
            console.log(error);
        }
    }

    const _recoverStorage=async(id, slot)=>{
        try {
            if(user.wallet){
                const c = await connectNFTContract(user.wallet);
                const tx = await c.recoverData(id, slot);
                return tx;
            }
            return;
        } catch (error) {
            console.log(error)
        }
    }

    const isPassholder =async()=>{
        try {
            if(user.wallet){
                const c = await connectNFTContract(user.wallet);
                const bal = await c.balanceOf(user.wallet);
                console.log(bal.toNumber());
                console.log("going through")
                return bal.toNumber();
            }
        } catch (error) {
            console.log(error);
            setError({error: error , errorMsg: "Pass Balance Fetch Failed"})
        }
    }

    const boostPass = async(weeks, id)=>{
        try {
            const c = await connectNFTContract(user.wallet);
            const w = await c.getWeeklyFee();
            console.log(w)
            const f = parseInt(w[1]); 
           // console.log(f)
            let fee = f * (weeks + 5) ;
            if (weeks == 0){
                fee = 0;
            }
            //console.log(fee)
            //const fff = ethers.utils.parseEther(fee.toString());
            const fff = ethers.utils.formatEther(fee);
            const feeToken = await c.getFeeToken();
            const token = await connectErc20(user.wallet , feeToken);
            const apr = await token.approve(PassAddress.lineaTestnet , fff);
            let t;
            
            t = await c.boostPass(weeks, id);
            
            let object = {
                totalFee: fee,
                tx: t
            }
            return object
        } catch (error) {
            console.log(error)
        }
    }

    const getWeeklyFee = async(weeks) =>{
        try {
            const c = await connectNFTContract(user.wallet);
            const w = await c.getWeeklyFee();
            const f = hexToNumber(w[1]); 
            console.log(f)
            const fee = f * (weeks + 5) ;
            const parse = ethers.utils.formatEther(fee);
            if(weeks != 0)
            {return parse};
            if(weeks == 0){
                return "0"
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getPassInfo = async()=>{
        try {
            try {
                if (user.wallet) {
                  const promises = [];
                  const arr = [];
                  const c = await connectNFTContract(user.wallet);
                  const supply = 100000;
            
                  for (let i = 0; i < supply; i++) {
                    let maps = await c._zonepassmaps(i);
                    let l = [];                        
                    // Check if maps[1] is "0x0000000000000000000000000000000000000000"
                    if (maps[1] === "0x0000000000000000000000000000000000000000") {
                      break; // Exit the loop when the condition is met
                    }
                    let objs = {maps: maps , id: i};
                    promises.push(objs);
                    // You don't need this line: await new Promise(resolve => resolve);
                  }
            
                  const r = await Promise.all(promises);
                  
                  r.forEach(r => {
                    let res = r.maps;
                    let holder = res[1].toUpperCase();
                    let us = user.wallet.toUpperCase();
                    if(holder === us){
                        let ans = [];
                        
                        const mintner = res[0];
                        const holder = res[1];
                        const mch = res[2]
                        const ach = res[3]
                        const mintTime = unixTimeToHumanReadable(res[5].toLocaleString());
                        const lastRen = unixTimeToHumanReadable(res[6].toLocaleString());
                        const exp = unixTimeToHumanReadable(res[7].toLocaleString());
                        const usedSlots = res[8].toNumber();
                        const totalSlots = res[9].toNumber();
                        const points = res[10].toNumber();
                        const id_ = res[4].toNumber();
                        let userBalances = {id: id_ , minter: mintner , holder: holder , mintChainId: mch , activeChainId: ach, mintTime: mintTime
                        , lastRenewal: lastRen , expiry: exp , totalSlots: totalSlots , useSlots: usedSlots , points: points }
                        
                        
                        arr.push(userBalances);
                    }
                  });
            
                 // console.log(arr);
                  setUserPass(arr);
                  return arr;
                }
              } catch (error) {
                console.log(error);
              }
        } catch (error) {
            console.log(error);
        }
    }

    const getIdBalance = async(id , token) =>{
        try {
            if(user.wallet){
            const c = await connectNFTContract(user.wallet);
            const bal = await c.getIdBalance(token , id);
            return bal; 
            }
        } catch (error) {
            console.log(error);
        }
    }

    const depositToId = async(id , token , amount)=>{
        try {
            if(user.wallet){
            const con = await connectTransferContract(user.wallet);
            const fee = await con.getFee();
            const deposit = await con.deposit(id, token , amount,{value: fee});
            return deposit;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const transferPointsFn=async(fromId , toId , amount)=>{
        try {
            if(user.wallet){
                const con = await connectTransferContract(user.wallet);
                const fee = await con.getFee();
                const tx = await con.transferPoints(fromId, toId, amount,{value:fee});
                return tx;
            }
        } catch (error) {
            console.log(error)
        }
    }

    const withDrawFromId = async(id , token , amount)=>{
        try {
            if(user.wallet){
            const con = await connectTransferContract(user.wallet);
            const fee = await con.getFee();
            const deposit = await con.withdraw(id, token, user.wallet , amount,{value:fee});
            return deposit;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const idtoid = async(id1 , id2 , token , amount) =>{
        try {
            if(user.wallet){
                const con = await connectTransferContract(user.wallet);
                const fee = await con.getFee();
                const tx = await con.idToId(id1 , id2 , token , amount,{value:fee});
                return tx;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const buyRevenue = async(id , percent, bool) => {
        try {
            if(user.wallet){
                const con = await connectTransferContract(user.wallet);
                const feePercent = await con.getFeePerPercent();
                const fee = ethers.utils.formatEther(feePercent);
                const fe = parseInt(fee);
                const totalFee = (fe * percent)*2;
                const fr = ethers.utils.parseEther(totalFee.toString());
                console.log(fr)
                console.log(fee , percent)
                if(bool == false){
                    const tx = await con.buyRevenuePercent(id , percent, false , id,{value:fr});
                } else if(bool == true){
                    const tx = await con.buyRevenuePercent(id , percent, true , id);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getPercentCost = async() =>{
        try {
            if(user.wallet){
                const con  =await connectTransferContract(user.wallet);
                const price  = await con.getFeePerPercent();
                return price;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const listNFT = async(nftAdr , id , paymentToken ,price, days)=>{
        try {
            if(user.wallet){
                const list = {
                    // address of the contract the asset you want to list is on
                    assetContractAddress: nftAdr,
                    // token ID of the asset you want to list
                    tokenId: id,
                    // how many of the asset you want to list
                    quantity: 1,
                    // address of the currency contract that will be used to pay for the listing
                    currencyContractAddress: paymentToken,
                    // The price to pay per unit of NFTs listed.
                    pricePerToken: price,
                    // when should the listing open up for offers
                    startTimestamp: new Date(Date.now()),
                    // how long the listing will be open for
                    endTimestamp: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
                    // Whether the listing is reserved for a specific set of buyers.
                    isReservedListing: false
                }
                const con = await connectMarketPlace(user.wallet);
                const tx = await con.createListing(list);
                return tx.listingId;
            }
        } catch (error) {
            console.log(error)
        }
    }

    const cancelListing= async(listingId)=>{
        try {
            if(user.wallet){
                const con = await connectMarketPlace(user.wallet);
                const tx = await con.cancelListing(listingId);
                return tx.listingId;
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateListing= async(listingId , nftAdr , id , paymentToken ,price, days)=>{
        try {
            if(user.wallet){
                const list = {
                    // address of the contract the asset you want to list is on
                    assetContractAddress: nftAdr,
                    // token ID of the asset you want to list
                    tokenId: id,
                    // how many of the asset you want to list
                    quantity: 1,
                    // address of the currency contract that will be used to pay for the listing
                    currencyContractAddress: paymentToken,
                    // The price to pay per unit of NFTs listed.
                    pricePerToken: price,
                    // when should the listing open up for offers
                    startTimestamp: new Date(Date.now()),
                    // how long the listing will be open for
                    endTimestamp: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
                    // Whether the listing is reserved for a specific set of buyers.
                    isReservedListing: false
                }
                const con = await connectMarketPlace(user.wallet);
                const tx = await con.cancelListing(listingId , list);
                return tx.listingId;
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAllListings = async()=>{
        try {
            if(user.wallet){
                console.log("C")
                const con = await connectMarketPlace(user.wallet)
                const tx = await con.getAllListings(1698101307,1698111307);
                console.log(tx)
                return tx
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAllValidListings = async()=>{
        try {
            if(user.wallet){
                const con = await connectMarketPlace(user.wallet)
                const tx = await con.getAllValid();
                return tx
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getTotalListings = async()=>{
        try {
            if(user.wallet){
                const con = await connectMarketPlace(user.wallet)
                const tx = await con.totalListings();
                return tx
            }
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async(title , description , reference, extra , email , days , price)=>{
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            //console.log(title)
            const balanceWei = await provider.getBalance(user.wallet);
            const nnn = hexToNumber(balanceWei)
            const {contract, sym} =  await connectForm(user.wallet);
            const pric = await contract.formFee();
            const mmm = hexToNumber(pric)
            const fff = ethers.utils.formatEther(pric)
            if(mmm > nnn) {
                alert(`Not Enough Balance , Required ${fff} $${sym}`)
                return
            }
            
            const tt = stringToHex(title);
            const desc= stringToHex(description)
            const ref = stringToHex(reference)
            const extra_ = stringToHex(extra)
            console.log(tt , title)
            const em = stringToHex(email)
            const tx = await contract.submit(tt , desc, ref ,extra_, em , days , price,{value: pric});
            
            return tx;
        } catch (error) {
            console.log(error)
        }
    }
    
    const getAllForms = async() =>{
        try {
            if(user.wallet){
            //console.log(user)
            let promises = [] , results = [] ;
            const {contract, sym} = await connectForm(user.wallet)
            //console.log(sym , "")
            //console.log(contract)
            const n = await contract.getUserNonce(user.wallet);
            const ff = await contract.formFee();
            const _fee = ethers.utils.formatEther(ff) 
            //console.log(n)
            const nn = hexToNumber(n);
            //console.log(nn)
            for(let i = 0 ; i < nn; i++){
                const form = await contract.getFormData(user.wallet , i);
                let objs = {form : form , id: i}
                promises.push(objs);
            }
            const res = await Promise.all(promises);

            res.forEach(res=>{
                let form = res.form;
                const _id = res.id
                const title = hexToString(form[0])
                const desc = hexToString(form[1])
                const ref = hexToString(form[2])
                const oth = hexToString(form[3])
                const mai = hexToString(form[4])
                const ti = hexToNumber(form[5])
                const bud = hexToNumber(form[6])
                let obj = {
                    formId: _id,
                    title: title,
                    description: desc,
                    reference: ref,
                    extras: oth,
                    email:mai,
                    budget: bud,
                    time: ti
                }
                results.push(obj);
            })
           // console.log(results)
            return {results, _fee};
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    const getFormFee = async() => {
        try {
            if(user.wallet){
                const {contract, sym }= await connectForm(user.wallet);
                const f = await contract.formFee()
                const fee = ethers.utils.formatEther(f);
                return fee;
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getRevenueData = async(id) => {
        if(user.wallet){
            console.log(id);
            const con = await connectNFTContract(user.wallet);
            const shares = await con.revenueData(id);
            const h = hexToNumber(shares);
            console.log(h);
            return h;
        }
    }

    return(<>
   
    <DappAppContext.Provider value={{user , error, userPass,connectWallet, mint, isPassholder, getPassInfo,
    _delStorage , _addToStorage, _recoverStorage , depositToId , withDrawFromId, getIdBalance, idtoid , listNFT,
    cancelListing , updateListing, getAllListings , getAllValidListings, getTotalListings, getStorage, boostPass,
    getWeeklyFee, getChainId , submitForm , getAllForms , getFormFee, transferPointsFn, buyRevenue, getRevenueData
    , getPercentCost
    }}>
        {children}
    </DappAppContext.Provider>
   
    </>
    )
}