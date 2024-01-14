import ABI from "./ABIs/WORMHOLEBRIDGEv1.json"
import ERC20Abi from './ABIs/IERC20.json'
import { appConfigData } from "./configs"

const bridgeV1Abi = ABI.abi
const tokenAbi = ERC20Abi.abi
const configData = appConfigData;

const btnStyles = 'flex items-center gap-[5px] py-[5px] px-[10px] bg-[#C1D2BC] font-semibold text-[12px] md:text-[14px] lg:text-[16px]'


export { bridgeV1Abi , configData, btnStyles, tokenAbi}