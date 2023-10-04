import { abi as POOL_ABI } from '@cryptoswap2/v3-core/artifacts/contracts/CryptoV3Pool.sol/CryptoV3Pool.json'
import { Contract, Wallet } from 'ethers'
import { ICryptoV3Pool } from '../../typechain-types'

export default function poolAtAddress(address: string, wallet: Wallet): ICryptoV3Pool {
  return new Contract(address, POOL_ABI, wallet) as ICryptoV3Pool
}
