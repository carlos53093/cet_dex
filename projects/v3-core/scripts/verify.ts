import { verifyContract } from '../../../common/verify'
import { sleep } from '../../../common/sleep'

async function main() {
  const networkName = network.name
  const deployedContracts = await import(`../../v3-core/deployments/${networkName}.json`)

  // Verify CryptoV3PoolDeployer
  console.log('Verify CryptoV3PoolDeployer')
  await verifyContract(deployedContracts.CryptoV3PoolDeployer)
  await sleep(10000)

  // Verify cryptoV3Factory
  console.log('Verify cryptoV3Factory')
  await verifyContract(deployedContracts.CryptoV3Factory, [deployedContracts.CryptoV3PoolDeployer])
  await sleep(10000)

  console.log('Verify feeManager')
  await verifyContract(deployedContracts.FeeManager)
  await sleep(10000)

  // await verifyContract('0x5Ecb5717120E1A10Ec778322eC82Ba781E5420E0')
  // await sleep(10000)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
