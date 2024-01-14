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
          <div className="w-[22px] h-[17px] relative">
          <div className="w-[22px] h-[0px] left-[22px] top-[-0px] absolute origin-top-left -rotate-180 border border-white"></div>
          <div className="w-[22px] h-[0px] left-[22px] top-[8.50px] absolute origin-top-left -rotate-180 border border-white"></div>
          <div className="w-[22px] h-[0px] left-[22px] top-[17px] absolute origin-top-left -rotate-180 border border-white"></div>
          </div>
        </div>

        <div className='hidden md:flex gap-4 justify-between'>    
            <button>Home</button>
            <button>Wormhole Scan</button>
            <div className="w-[126px] h-[34px] relative" onClick={()=> connectWallet()}>
              <Image className="w-[126px] h-[34px] left-0 top-0 absolute rounded-[51px]" src="/Assets/BRIDGEUI/ConnectButton/ggg.svg" height={34} width={126} alt="connect wallet"/>
              <div className="w-[60.21px] h-[18.89px] left-[51.29px] top-[7.56px] absolute bg-blue-900 shadow backdrop-blur-[20px]"></div>
              <div className="w-[51.29px] h-[16.37px] left-[60px] top-[10px] absolute text-white text-[11px] font-bold font-['K2D']">
                {user.address ?
                <>0x...{user.address.slice(37)}</>:
                <>CONNECT</>  
              }
              </div>
            </div>

        </div>
      
      </div>


      {/*MAIN PAGE*/}

      <div className='flex flex-col items-center justify-between gap-[4rem] mt-[10rem]'>

            
          <div className='flex flex-col w-[322px] h-[230px] bg-sky-900 bg-opacity-50 rounded-2xl shadow'>
              
              <div className="flex justify-between">
                
                <div>
                  HELLo
                </div>
              
                <div className=''>
                  <div className='flex w-[140px] h-[140px] bg-indigo-300 bg-opacity-30 rounded-[19px] z-10'>
                    
                  </div>
                  <Image className="absolute -z-10 w-[94px] h-[118px] rotate-90 right-[30px] -mt-[50px]" src="/Assets/BRIDGEUI/Phone/Phone/hud.svg" width={0} height={0} alt="HUD"/>
                </div>
              </div>

              <div>
                Lower El
              </div>
          </div>

          <div className='flex flex-col w-[322px] h-[230px] bg-sky-900 bg-opacity-50 rounded-2xl shadow'>
            <div className="w-[94px] h-[113px] bg-indigo-300 bg-opacity-60 rounded-[19px]">
                <Image className="w-[94px] h-[98px] origin-top-left rotate-90" src="/Assets/BRIDGEUI/ConnectButton/ggg.svg" width={0} height={0} alt="HUD"/>
            </div>
            <div>
                Lower El
            </div>
          </div>
        
        </div>    
     
    </div>
  )
}
