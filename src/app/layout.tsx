import './globals.css'
//import { Inter } from 'next/font/google'
//import { AppProvider } from '../Context/appReactiveContext'
import React from 'react'
import { Analytics } from '@vercel/analytics/react'
//const inter = Inter({ subsets: ['latin'] })
import {BridgeV1Provider} from '../Context/bridgeV1Context'
import Header from '../Comp/Header'
export const metadata = {
  title: 'GrayZone Web3 Services',
  description: 'Official Site for GrayZone Web3 Service Agency',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <BridgeV1Provider>
          <main>
          <Header/>
          {children}
          </main>
        </BridgeV1Provider>
        <Analytics/>
        </body>
    </html>
  )
}
