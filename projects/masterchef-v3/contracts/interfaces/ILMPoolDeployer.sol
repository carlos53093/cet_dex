// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./ICryptoV3Pool.sol";
import "./ILMPool.sol";

interface ILMPoolDeployer {
    function deploy(ICryptoV3Pool pool) external returns (ILMPool lmPool);
}
