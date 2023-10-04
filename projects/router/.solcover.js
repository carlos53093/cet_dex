module.exports = {
  skipFiles: [
    "libraries/Babylonian.sol",
    "libraries/Math.sol",
    "libraries/CryptoLibrary.sol",
    "libraries/SafeMath.sol",
    "libraries/UQ112x112.sol",
    "libraries/WBNB.sol",
    "CryptoERC20.sol",
    "CryptoFactory.sol",
    "CryptoPair.sol",
    "CryptoRouter.sol",
    "CryptoRouter01.sol",
    "V2SwapRouter.sol",
    "StableSwapRouter.sol",
    "utils/MockERC20.sol",
    "contracts/base/ApproveAndCall.sol"
  ],
  configureYulOptimizer: true,
  solcOptimizerDetails: {
    yul: true,
  },
};
