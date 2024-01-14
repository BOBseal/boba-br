'use client'
import React from 'react'
import Image from 'next/image'
import Header from '@/Comp/Header'
export default function Home() {
  //const {dark , setDark , handleThemeChange} = useContext(AppContext);
  
  return (
    <div className="flex h-screen min-w-screen relative flex-wrap pb-[2rem]">
      
      <Image src={'/Assets/BRIDGEUI/Desktop/mainbg.svg'} width={0} height={0} alt="GrayZone" className={`h-full w-full object-cover -z-50 md:object-cover absolute top-0 left-0`}/>
      <div className='h-full w-screen bg-black absolute -z-40 bg-opacity-70 top-0 left-0'/>
     
      <div className='flex h-[60px] lg:h-[133px] w-full bg-black bg-opacity-25 border-b-4 border-blue-400'>
        
      </div>
     
    </div>
  )
}
