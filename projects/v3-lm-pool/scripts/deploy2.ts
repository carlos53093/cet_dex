import { ethers, network } from 'hardhat'
// import { configs } from '@cryptoswap2/common/config'
// import { tryVerify } from '@cryptoswap2/common/verify'
import fs from 'fs'
import { abi } from '@cryptoswap2/v3-core/artifacts/contracts/CryptoV3Factory.sol/CryptoV3Factory.json'
import { configs } from '../../../common/config';

import { parseEther } from 'ethers/lib/utils'
const currentNetwork = network.name

async function main() {
  const [owner] = await ethers.getSigners()
  // Remember to update the init code hash in SC for different chains before deploying
  const networkName = network.name
  const config = configs[networkName as keyof typeof configs]
  if (!config) {
    throw new Error(`No config found for network ${networkName}`)
  }

  const v3DeployedContracts = await import(`../../v3-core/deployments/${networkName}.json`)
  const mcV3DeployedContracts = await import(`../../masterchef-v3/deployments/${networkName}.json`)

  const cryptoV3Factory_address = v3DeployedContracts.CryptoV3Factory

  const CryptoV3LmPoolDeployer = await ethers.getContractFactory('CryptoV3LmPoolDeployer')
  const cryptoV3LmPoolDeployer = await CryptoV3LmPoolDeployer.deploy(mcV3DeployedContracts.MasterChefV3)

  console.log('cryptoV3LmPoolDeployer deployed to:', cryptoV3LmPoolDeployer.address)

  const cryptoV3Factory = new ethers.Contract(cryptoV3Factory_address, abi, owner)

  await cryptoV3Factory.setLmPoolDeployer(cryptoV3LmPoolDeployer.address)

  const contracts = {
    CryptoV3LmPoolDeployer: cryptoV3LmPoolDeployer.address,
  }
  fs.writeFileSync(`./deployments/${networkName}.json`, JSON.stringify(contracts, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
