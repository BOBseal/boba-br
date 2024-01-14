'use client'
import React,{useContext} from 'react'
import Image from 'next/image'
import { BridgeV1Context } from '@/Context/bridgeV1Context'
export default function Home() {
  //const {dark , setDark , handleThemeChange} = useContext(AppContext);
  const {user, connectWallet} = useContext(BridgeV1Context)
  return (
    <div className="flex h-screen min-w-screen relative flex-wrap pb-[2rem]">
      
      <Image src={'/Assets/BRIDGEUI/Desktop/mainbg.svg'} width={0} height={0} alt="GrayZone" className={`h-full w-full object-cover -z-50 md:object-cover absolute top-0 left-0`}/>
      <div className='h-full w-screen bg-black absolute -z-40 bg-opacity-70 top-0 left-0'/>
     
      <div className='flex pl-[2rem] h-[60px] lg:h-[133px] text-white w-full bg-black bg-opacity-25 border-b-4 border-blue-400 justify-between items-center'>
        <div>LOGO</div>
        
        <div className='flex pr-[2rem] md:hidden'>
          <Image src={'/Assets/BRIDGEUI/mobile-menu-int.svg'} width={30} height={30} className=""/>
        </div>

        <div className='hidden md:flex gap-4 justify-between'>    
            <button>Home</button>
            <button>Wormhole Scan</button>
            <button className='flex p-1 rounded-3xl'>{user.address ? <>0x...{user.address.slice(37)}</>:<>Connect Wallet</>}</button>
        </div>
      
      </div>
     
    </div>
  )
}
