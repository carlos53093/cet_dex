import { ethers, waffle } from 'hardhat'
import { expect } from './shared/expect'
import { CryptoInterfaceMulticallTest } from '../typechain-types'
import { Wallet } from 'ethers'

describe('CryptoInterfaceMulticall Test', () => {

  let wallet: Wallet
  let trader: Wallet

  let cryptoInterfaceMulticall: CryptoInterfaceMulticallTest
  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>

  before('deploy test contract', async () => {
    cryptoInterfaceMulticall = (await (await ethers.getContractFactory('CryptoInterfaceMulticallTest')).deploy()) as CryptoInterfaceMulticallTest
    ;[wallet, trader] = await (ethers as any).getSigners()
    loadFixture = waffle.createFixtureLoader([wallet, trader])
  })

  describe('test functions', () => {
    it('getCurrentBlockTimestamp', async () => {
        console.log(await cryptoInterfaceMulticall.getCurrentBlockTimestampTest())
    //   expect(await cryptoInterfaceMulticall.encode(stringToHex(''))).to.eq('')
    })
    it('getEthBalance', async () => {
      expect(await cryptoInterfaceMulticall.getEthBalanceTest(wallet.address)).to.gt(ethers.utils.parseEther('9.9'))
    })
    it('multicall', async () => {
      let tx = await cryptoInterfaceMulticall.multicallTest(wallet.address, '10000000000000000', '')
      let res = await tx.wait()
      expect(res.events[0].args.success).to.eq(true)
    })
  })
})
