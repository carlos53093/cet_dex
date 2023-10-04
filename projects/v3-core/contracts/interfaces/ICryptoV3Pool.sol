// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

import './pool/ICryptoV3PoolImmutables.sol';
import './pool/ICryptoV3PoolState.sol';
import './pool/ICryptoV3PoolDerivedState.sol';
import './pool/ICryptoV3PoolActions.sol';
import './pool/ICryptoV3PoolOwnerActions.sol';
import './pool/ICryptoV3PoolEvents.sol';

/// @title The interface for a CryptoSwap V3 Pool
/// @notice A CryptoSwap pool facilitates swapping and automated market making between any two assets that strictly conform
/// to the ERC20 specification
/// @dev The pool interface is broken up into many smaller pieces
interface ICryptoV3Pool is
    ICryptoV3PoolImmutables,
    ICryptoV3PoolState,
    ICryptoV3PoolDerivedState,
    ICryptoV3PoolActions,
    ICryptoV3PoolOwnerActions,
    ICryptoV3PoolEvents
{

}
