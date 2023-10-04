import { FeeManager } from './../../typechain-types/contracts/FeeManger.sol/FeeManager';
import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { MockTimeCryptoV3Pool } from '../../typechain-types/contracts/test/MockTimeCryptoV3Pool'
import { TestERC20 } from '../../typechain-types/contracts/test/TestERC20'
import { CryptoV3Factory } from '../../typechain-types/contracts/CryptoV3Factory'
import { CryptoV3PoolDeployer } from '../../typechain-types/contracts/CryptoV3PoolDeployer'
import { TestCryptoV3Callee } from '../../typechain-types/contracts/test/TestCryptoV3Callee'
import { TestCryptoV3Router } from '../../typechain-types/contracts/test/TestCryptoV3Router'
import { MockTimeCryptoV3PoolDeployer } from '../../typechain-types/contracts/test/MockTimeCryptoV3PoolDeployer'
import CryptoV3LmPoolArtifact from '@cryptoswap2/v3-lm-pool/artifacts/contracts/CryptoV3LmPool.sol/CryptoV3LmPool.json'

import { Fixture } from 'ethereum-waffle'

interface FactoryFixture {
  factory: CryptoV3Factory,
}

interface FeeManagerFixture {
  feeManager: FeeManager,
}

interface DeployerFixture {
  deployer: CryptoV3PoolDeployer
}

async function factoryFixture(): Promise<FactoryFixture> {
  const { deployer } = await deployerFixture()
  const factoryFactory = await ethers.getContractFactory('CryptoV3Factory')
  const factory = (await factoryFactory.deploy(deployer.address)) as CryptoV3Factory
  return { factory }
}

async function feeManagerFixture(factory: string): Promise<FeeManagerFixture> {
  const feeManagerFactory = await ethers.getContractFactory('FeeManager')
  const feeManager = (await feeManagerFactory.deploy()) as FeeManager
  feeManager.setFactory(factory)
  return { feeManager }
}

async function deployerFixture(): Promise<DeployerFixture> {
  const deployerFactory = await ethers.getContractFactory('CryptoV3PoolDeployer')
  const deployer = (await deployerFactory.deploy()) as CryptoV3PoolDeployer
  return { deployer }
}

interface TokensFixture {
  token0: TestERC20
  token1: TestERC20
  token2: TestERC20
}

async function tokensFixture(): Promise<TokensFixture> {
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const tokenA = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenB = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenC = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20

  const [token0, token1, token2] = [tokenA, tokenB, tokenC].sort((tokenA, tokenB) =>
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1
  )

  return { token0, token1, token2 }
}

type TokensAndFactoryFixture = FactoryFixture & TokensFixture & FeeManagerFixture

interface PoolFixture extends TokensAndFactoryFixture {
  swapTargetCallee: TestCryptoV3Callee
  swapTargetRouter: TestCryptoV3Router
  createPool(
    fee: number,
    tickSpacing: number,
    firstToken?: TestERC20,
    secondToken?: TestERC20
  ): Promise<MockTimeCryptoV3Pool>
}

// Monday, October 5, 2020 9:00:00 AM GMT-05:00
export const TEST_POOL_START_TIME = 1601906400

export const poolFixture: Fixture<PoolFixture> = async function (): Promise<PoolFixture> {
  const { factory } = await factoryFixture()
  const { token0, token1, token2 } = await tokensFixture()
  const { feeManager } = await feeManagerFixture(factory.address)
  await factory.changeFeeManager(feeManager.address)

  const MockTimeCryptoV3PoolDeployerFactory = await ethers.getContractFactory('MockTimeCryptoV3PoolDeployer')
  const MockTimeCryptoV3PoolFactory = await ethers.getContractFactory('MockTimeCryptoV3Pool')

  const calleeContractFactory = await ethers.getContractFactory('TestCryptoV3Callee')
  const routerContractFactory = await ethers.getContractFactory('TestCryptoV3Router')

  const swapTargetCallee = (await calleeContractFactory.deploy()) as TestCryptoV3Callee
  const swapTargetRouter = (await routerContractFactory.deploy()) as TestCryptoV3Router

  const CryptoV3LmPoolFactory = await ethers.getContractFactoryFromArtifact(CryptoV3LmPoolArtifact)
  return {
    token0,
    token1,
    token2,
    factory,
    feeManager,
    swapTargetCallee,
    swapTargetRouter,
    createPool: async (fee, tickSpacing, firstToken = token0, secondToken = token1) => {
      const mockTimePoolDeployer =
        (await MockTimeCryptoV3PoolDeployerFactory.deploy()) as MockTimeCryptoV3PoolDeployer
      const tx = await mockTimePoolDeployer.deploy(
        factory.address,
        firstToken.address,
        secondToken.address,
        fee,
        tickSpacing
      )

      const receipt = await tx.wait()
      const poolAddress = receipt.events?.[0].args?.pool as string

      const mockTimeCryptoV3Pool = MockTimeCryptoV3PoolFactory.attach(poolAddress) as MockTimeCryptoV3Pool

      await (
        await factory.setLmPool(
          poolAddress,
          (
            await CryptoV3LmPoolFactory.deploy(
              poolAddress,
              ethers.constants.AddressZero,
              Math.floor(Date.now() / 1000)
            )
          ).address
        )
      ).wait()

      return mockTimeCryptoV3Pool
    },
  }
}
