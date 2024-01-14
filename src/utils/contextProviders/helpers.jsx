import { ethers } from "ethers";
import {hexToNumber} from 'viem';
import { bridgeV1Abi , tokenAbi} from '../constants/index'
// returns array of accounts of user's injected provider, returns false if injected provider not detected
export const connectMetamask = async()=> {
    try {
        if(window.ethereum){
            const obj = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            return obj;
        } else return false;
    } catch (error) {
        console.log(error)
    }
}

export const switchNetwork =async(chainIdHex) => {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId: chainIdHex}],
        });
    } catch (error) {
        console.log(error);
    }
}

export const addNetwork = async(networkConfig)=>{
    try {
        await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: networkConfig,
        });
    } catch (error) {
        console.log(error)
    }
}

export const signMetamask = async() => {
    try {
        console.log("EMPTY FUNCTION PUT LOGIC AFTER")
    } catch (error) {
        console.log(error)
    }
}

// returns chain object {hexFormat , numFormat}
export const getCurrentChainId = async() =>{
    try {
        if(window.ethereum){
            const chainId = await window.ethereum.request({ method: "eth_chainId" });
            return {hex: chainId, num: hexToNumber(chainId)};
        }
    } catch (error) {
        console.log(error);
    }
}
// returns contract obj for v1 bridge contracts
export const connectContract = async(contract , user) =>{
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(user); 
        const _contract = new ethers.Contract( contract , bridgeV1Abi, signer);
        return _contract;
    } catch (error) {
        console.log(error);
    }
}

export const connectERC20 = async(contract , user) =>{
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(user); 
        const _contract = new ethers.Contract( contract , tokenAbi, signer);
        return _contract;        
    } catch (error) {
        console.log(error)
    }
}

export const approveERC = async(token,spender, amount ,allower) =>{
    try {
        const contract =await connectERC20(token , allower);
        const aprove = await contract.approve(spender , amount);
        return aprove;
    } catch (error) {
        console.log(error);
    }
}