# Solidity API

## CryptoV3PoolSwapTest

### getSwapResult

```solidity
function getSwapResult(address pool, bool zeroForOne, int256 amountSpecified, uint160 sqrtPriceLimitX96) external returns (int256 amount0Delta, int256 amount1Delta, uint160 nextSqrtRatio)
```

### cryptoV3SwapCallback

```solidity
function cryptoV3SwapCallback(int256 amount0Delta, int256 amount1Delta, bytes data) external
```

Called to `msg.sender` after executing a swap via ICryptoV3Pool#swap.

_In the implementation you must pay the pool tokens owed for the swap.
The caller of this method must be checked to be a CryptoV3Pool deployed by the canonical CryptoV3Factory.
amount0Delta and amount1Delta can both be 0 if no tokens were swapped._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0Delta | int256 | The amount of token0 that was sent (negative) or must be received (positive) by the pool by the end of the swap. If positive, the callback must send that amount of token0 to the pool. |
| amount1Delta | int256 | The amount of token1 that was sent (negative) or must be received (positive) by the pool by the end of the swap. If positive, the callback must send that amount of token1 to the pool. |
| data | bytes | Any data passed through by the caller via the ICryptoV3PoolActions#swap call |

