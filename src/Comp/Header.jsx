'use client'
import React from 'react'
import Image from 'next/image'
const Header = () => {
  return (
    <div className='flex flex-col h-full border-b-[4px] justify-center'>
     <Image src={'/Assets/BRIDGEUI/Desktop/mainbg.svg'} width={0} height={133} alt="GrayZone" className={`w-screen object-cover -z-10 md:object-cover absolute top-0 left-0`}/>
    
    <div className='z-10 flex h-full w-full justify-between pt-[40px] pr-[40px] pl-[40px] text-white items-center'>
        <div>
            LOGO
        </div>
        
        <div className='items-center pr-[2rem] absolute right-0 top-[5px] md:hidden'>
            <Image src={'/Assets/BRIDGEUI/mobile-menu-int.svg'} height={20} width={30} />
        </div>
      </div>
    </div>
  )
}

export default Header