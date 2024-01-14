"use client"

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'
//import { network } from 'hardhat'

// 1. Get projectId
const projectId = 'YOUR_PROJECT_ID'

// 2. Set chains
const networks = {
    polygon: {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
    },
    bsc: {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
    },
    base: {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
    },
    arbitrum: {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
    },
    optimism: {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
    },
}

// 3. Create modal
const metadata = {
  name: 'Nebula Bridge',
  description: 'Official Nebula Bridge',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [networks.base , networks.polygon , networks.bsc , networks.optimism , networks.arbitrum],
  projectId
})

export function Web3ModalProvider({ children }) {
  return children;
}