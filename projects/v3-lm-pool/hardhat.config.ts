import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@typechain/hardhat'
import 'dotenv/config'
import { NetworkUserConfig } from 'hardhat/types'
import 'solidity-docgen';
import "solidity-coverage";

require('dotenv').config({ path: require('find-config')('.env') })

const bscTestnet: NetworkUserConfig = {
  url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  chainId: 97,
  accounts: [process.env.PRIVATEKEY!],
}

const bscMainnet: NetworkUserConfig = {
  url: 'https://bsc-dataseed.binance.org/',
  chainId: 56,
  accounts: [process.env.PRIVATEKEY!],
}

const goerli: NetworkUserConfig = {
  url: 'https://rpc.ankr.com/eth_goerli',
  chainId: 5,
  accounts: [process.env.PRIVATEKEY!],
}

const eth: NetworkUserConfig = {
  url: 'https://eth.llamarpc.com',
  chainId: 1,
  accounts: [process.env.PRIVATEKEY!],
}

const polygon:NetworkUserConfig =  {
  url: "https://polygon.llamarpc.com",
  chainId: 137,
  accounts: [process.env.PRIVATEKEY!]
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.7.6',
  },
  networks: {
    hardhat: {},
    ...(process.env.PRIVATEKEY && { bscTestnet }),
    ...(process.env.PRIVATEKEY && { bscMainnet }),
    ...(process.env.PRIVATEKEY && { goerli }),
    ...(process.env.PRIVATEKEY && { eth }),
    ...(process.env.PRIVATEKEY && { polygon }),
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY,
  },
  paths: {
    sources: './contracts/',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
}

export default config
