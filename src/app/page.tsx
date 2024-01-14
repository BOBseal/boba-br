'use client'
import React from 'react'
import Image from 'next/image'
import Header from '@/Comp/Header'
export default function Home() {
  //const {dark , setDark , handleThemeChange} = useContext(AppContext);
  
  return (
    <div className="flex h-screen min-w-screen relative flex-wrap pb-[2rem]">
      
      <Image src={'/Assets/BRIDGEUI/Desktop/mainbg.svg'} width={0} height={0} alt="GrayZone" className={`h-full w-full object-cover -z-10 md:object-cover absolute mt-[16px] top-0 left-0`}/>
      <div className='h-full w-screen bg-black absolute z-0 bg-opacity-70 top-0 mt-[1rem] left-0'/>
     
     
     
    </div>
  )
}
