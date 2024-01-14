'use client'
import React,{useContext} from 'react'
import Image from 'next/image'
import { BridgeV1Context } from '@/Context/bridgeV1Context'
export default function Home() {
  //const {dark , setDark , handleThemeChange} = useContext(AppContext);
  const {user, connectWallet} = useContext(BridgeV1Context)
  return (
    <div className="flex flex-col h-screen min-w-screen relative flex-wrap pb-[2rem]">
      
      <Image src={'/Assets/BRIDGEUI/Desktop/mainbg.svg'} width={0} height={0} alt="GrayZone" className={`h-full w-full object-cover -z-50 md:object-cover absolute top-0 left-0`}/>
      <div className='h-full w-screen bg-black absolute -z-40 bg-opacity-70 top-0 left-0'/>
     
      {/* HEADER */}
      <div className='flex pl-[2rem] h-[60px] md:h-[100px] text-white w-full bg-black bg-opacity-25 border-b-4 border-blue-400 justify-between items-center'>
        
        <div>LOGO</div>
        
        <div className='flex pr-[2rem] md:hidden'>
          <Image src={'/Assets/BRIDGEUI/mobile-menu-int.svg'} width={30} height={30} alt='menu' className=""/>
        </div>

        <div className='hidden md:flex gap-4 justify-between'>    
            <button>Home</button>
            <button>Wormhole Scan</button>
            <Image src={`/Assets/BRIDGEUI/connectButton.svg`} width={100} height={40} alt={"Connect Wallet"} className="object-contain"/>
            <button className='flex p-1 pl-2 pr-2 bg-blue-950 rounded-3xl'>{user.address ? <>0x...{user.address.slice(37)}</>:<>Connect Wallet</>}</button>
        </div>
      
      </div>


      {/*MAIN PAGE*/}

      <div className='flex flex-col items-center'>

        <div className=' items-center justify-between flex flex-col'>
        {/* BRIDGE CARD */}
            
              <Image src={`/Assets/BRIDGEUI/Desktop/bridge-card.svg`} width={0} height={0} alt={"Connect Wallet"} className="absoulte top-[5rem] h-[20rem] md:h-[21rem] w-[85%] object-cover md:w-[40rem] lg:w-[55rem] bg-transparent drop-shadow-2xl mt-[4rem] md:mt-[3rem] justify-center"/>
              <div className='absolute top-[5rem] h-[21rem] md:h-[21rem] w-[85%] md:w-[40rem] lg:w-[55rem] mt-[5rem] lg:mt-[6.2rem] md:mt-[5rem]'>
                <div className='flex justify-center items-center h-full w-full'>
                  <input type={'number'}/>
                </div>
              </div>
              
              <div className='flex mt-[2rem] md:mt-[1rem] lg:mt-[2.5rem]'>
                <Image src={'/Assets/BRIDGEUI/switch.svg'} height={0} width={0} alt="" className='object-cover h-[3rem] w-[3rem] md:w-[3.5rem] md:h-[3.5rem]'/>
              </div>

              <Image src={`/Assets/BRIDGEUI/Desktop/bridge-card.svg`} width={0} height={0} alt={"Connect Wallet"} className="absoulte w-[85%] object-cover h-[20rem] md:h-[21rem] md:w-[40rem] lg:w-[55rem] mt-[3rem] bg-transparent md:mt-[2rem] lg:mt-[3rem]  drop-shadow-2xl"/>
              <div className='absolute w-[85%] bottom-[4.4rem] md:bottom-[2.4rem] lg:bottom-[3rem] h-[21rem] md:h-[21rem] md:w-[40rem] lg:w-[55rem] md:mt-[5rem] lg:mt-[6rem]'>
                <div className='flex justify-center items-center h-full w-full'>
                  <input type={'number'}/>
                </div>
              </div>
        </div>    
        
      </div>
     
    </div>
  )
}
