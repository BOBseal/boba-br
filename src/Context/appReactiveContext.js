"use client";

import Image from 'next/image';
import React,{ useState } from 'react';


export const AppContext = React.createContext();
export const AppProvider = ({children})=> {

    const [dark, setDark] = useState(false)
  
    const handleThemeChange=async()=>{
      try {
        if(!dark) {
          setDark(true);
        }
        if(dark){
          setDark(false);
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }
    }

    return(<AppContext.Provider value={{dark , setDark , handleThemeChange}}>
        {children}
    </AppContext.Provider>)
}