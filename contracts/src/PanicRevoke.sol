// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title PanicRevoke
/// @notice Utility contract that simulates / previews batch-revoke operations.
///         Actual revoke is done by the wallet itself calling approve(spender, 0) directly
///         on each token contract (approvals are keyed to msg.sender).
///
///         This contract provides:
///         1. `simulateRevoke` — check that calling approve(0) would succeed (dry-run via staticcall)
///         2. `batchAllowance` — read current allowances for a list of (token, spender) pairs
///
///         Frontend uses `batchAllowance()` to build the display, then encodes individual
///         approve(0) calldata and sends via MetaMask batch-send or WalletConnect multicall.
contract PanicRevoke {
    struct RevokeTarget {
        address token;
        address spender;
    }

    /// @notice Check whether there is a nonzero allowance for (owner, token, spender).
    /// @param owner The address whose approval we're checking.
    /// @param token The ERC-20 token contract address.
    /// @param spender The spender to check.
    /// @return true if current allowance > 0.
    function canRevoke(
        address owner,
        address token,
        address spender
    ) external view returns (bool) {
        return IERC20(token).allowance(owner, spender) > 0;
    }

    /// @notice Batch-read allowances for multiple (token, spender) pairs.
    /// @param owner The address to read allowances for.
    /// @param targets Array of (token, spender) pairs.
    /// @return allowances Corresponding allowance for each target.
    function batchAllowance(
        address owner,
        RevokeTarget[] calldata targets
    ) external view returns (uint256[] memory allowances) {
        allowances = new uint256[](targets.length);
        for (uint256 i = 0; i < targets.length; ) {
            allowances[i] = IERC20(targets[i].token).allowance(owner, targets[i].spender);
            unchecked { ++i; }
        }
    }

    /// @notice Encode the calldata for approve(spender, 0) on a given token.
    /// @param token The ERC-20 token address.
    /// @param spender The spender to revoke.
    function encodeRevoke(
        address token,
        address spender
    ) external pure returns (address target, bytes memory data) {
        return (token, abi.encodeCall(IERC20.approve, (spender, 0)));
    }
}
