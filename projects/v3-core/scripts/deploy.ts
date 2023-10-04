// import { tryVerify } from '@pancakeswap/common/verify'
import { ContractFactory } from 'ethers'
import { ethers, network } from 'hardhat'
import fs from 'fs'

type ContractJson = { abi: any; bytecode: string }
const artifacts: { [name: string]: ContractJson } = {
  // eslint-disable-next-line global-require
  CryptoV3PoolDeployer: require('../artifacts/contracts/CryptoV3PoolDeployer.sol/CryptoV3PoolDeployer.json'),
  // eslint-disable-next-line global-require
  CryptoV3Factory: require('../artifacts/contracts/CryptoV3Factory.sol/CryptoV3Factory.json'),
  FeeManager: require('../artifacts/contracts/FeeManger.sol/FeeManager.json'),
}

async function main() {
  const [owner] = await ethers.getSigners()
  const networkName = network.name
  console.log('owner', owner.address)

  let cryptoV3PoolDeployer_address = ''
  let cryptoV3PoolDeployer
  const CryptoV3PoolDeployer = new ContractFactory(
    artifacts.CryptoV3PoolDeployer.abi,
    artifacts.CryptoV3PoolDeployer.bytecode,
    owner
  )
  if (!cryptoV3PoolDeployer_address) {
    cryptoV3PoolDeployer = await CryptoV3PoolDeployer.deploy()

    cryptoV3PoolDeployer_address = cryptoV3PoolDeployer.address
    console.log('cryptoV3PoolDeployer', cryptoV3PoolDeployer_address)
  } else {
    cryptoV3PoolDeployer = new ethers.Contract(
      cryptoV3PoolDeployer_address,
      artifacts.CryptoV3PoolDeployer.abi,
      owner
    )
  }

  let cryptoV3Factory_address = ''
  let cryptoV3Factory
  if (!cryptoV3Factory_address) {
    const CryptoV3Factory = new ContractFactory(
      artifacts.CryptoV3Factory.abi,
      artifacts.CryptoV3Factory.bytecode,
      owner
    )
    cryptoV3Factory = await CryptoV3Factory.deploy(cryptoV3PoolDeployer_address)

    cryptoV3Factory_address = cryptoV3Factory.address
    console.log('cryptoV3Factory', cryptoV3Factory_address)
  } else {
    cryptoV3Factory = new ethers.Contract(cryptoV3Factory_address, artifacts.cryptoV3Factory.abi, owner)
  }
  console.log("===============================deployed cryptoFactory===================")
  // Set FactoryAddress for cryptoV3PoolDeployer.
  await cryptoV3PoolDeployer.setFactoryAddress(cryptoV3Factory_address);

  console.log("===============================set Factory ===================")


  const FeeManager = new ContractFactory(
    artifacts.FeeManager.abi,
    artifacts.FeeManager.bytecode,
    owner
  )
  const feeManager = await FeeManager.deploy()

  console.log("===============================feeManager ===================", feeManager.address)
  await feeManager.setFactory(cryptoV3Factory_address)
  console.log("===============================setFactory ===================")
  await cryptoV3Factory.changeFeeManager(feeManager.address)
  console.log("===============================changeFeeManager ===================")

  const contracts = {
    CryptoV3Factory: cryptoV3Factory_address,
    CryptoV3PoolDeployer: cryptoV3PoolDeployer_address,
    FeeManager: feeManager.address
  }

  fs.writeFileSync(`./deployments/${networkName}.json`, JSON.stringify(contracts, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
