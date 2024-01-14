import abi from './ABIS/passAbi.json'
import bbi from './ABIS/genesisMintAbi.json'
import sbi from './ABIS/GRAYSTORE.json'
import tbi from './ABIS/TransferAbi.json'
import ebi from './ABIS/erc20.json'
import mbi from './ABIS/NftMarket.json'
import fbi from './ABIS/Form.json'

export const PassAddress ={
    goerli: {
        address: "0xEeAE8b69A51f6e8721cb5F42f858E6A8004e1503"
    },
    lineaTestnet:"0xA91c617Bd8cDa04a8fcC4d001CE98E3D87d7a5Ae",
    baseTestnet:"0x4280AD35a16613E703408334B0De266ACdaf66eD"
};

export const genesisMinter = {
    goerli:{
        address:"0xB1472af0B33A96b5E669E572A35B0D8f915ebB4a",
        chainId : "0x5"
    },
    lineaTestnet:"0x044954581d4683097F73d47F59DF0f8b580F27eF",
    baseTestnet:"0x95Ee881b80CE0601f9B1e506DD599ce85C11a025"
}

export const storageUnit = {
    goerli:"",
    lineaTestnet:"0x6F5A846dbD98f641F3371135650e24Ac0BAEdb87",
    baseTestnet:"0xa9Bf0321fC38440ec1bA3827f30DC85b377f8b83"
}

export const TransferUnit={
    goerli:"",
    lineaTestnet:"0xBecc2376b6B78Ae4EE224846e52C37699125970E",
    baseTestnet:"0x5f90fdC76b64d8E96a50c6EEeDfB5019F39703A1"
}

export const Market ={
    lineaTestnet:"0x49f8198a701c27d86a1F5fb461F80d8569751F45"
}

export const Lender = {
    lineaTestnet:"0xC104970c3A4cd2EacFf17227992EB44F52c3Fe7d"
}

export const HireForm = {
    lineaTestnet:"0x90592ddb549608376960f89cAa2C123AA3A36e26",
    fuse:"0xEB3A60E47a899B8776fb36B5EEDd16e589E722Ae",
    mantle:"0xc06a80778af273801ed5C14AB46883c446Dd6e23",
    polygon:"0x042929007BFb97363741D79DDf9A1aA4C2b7EBC9",
    base:"0x0ff9Ef29BD23c82E260aDEC858Aa1d7Cdf6ad33d"
}

export const MinterAbi = bbi.abi;
export const PassAbi = abi.abi;
export const StorageAbi = sbi.abi;
export const TransferAbi = tbi.abi;
export const ERC20Abi = ebi.abi;
export const MarketAbi = mbi.abi;
export const FormAbi = fbi.abi;