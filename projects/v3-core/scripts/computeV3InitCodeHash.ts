import { ethers } from 'hardhat'
import CryptoV3PoolArtifact from '../artifacts/contracts/CryptoV3Pool.sol/CryptoV3Pool.json'

const hash = ethers.utils.keccak256(CryptoV3PoolArtifact.bytecode)
console.log(hash)
