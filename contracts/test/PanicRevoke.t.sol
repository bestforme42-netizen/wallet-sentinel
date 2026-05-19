// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {PanicRevoke} from "../src/PanicRevoke.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @dev Minimal ERC-20 mock for testing
contract MockERC20 {
    string public name = "MockToken";
    string public symbol = "MTK";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "insufficient balance");
        require(allowance[from][msg.sender] >= amount, "insufficient allowance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        return true;
    }
}

contract PanicRevokeTest is Test {
    PanicRevoke public revoker;
    MockERC20 public token1;
    MockERC20 public token2;

    address public user = address(0xBEEF);
    address public spender1 = address(0xAAA);
    address public spender2 = address(0xBBB);

    function setUp() public {
        revoker = new PanicRevoke();
        token1 = new MockERC20();
        token2 = new MockERC20();

        vm.startPrank(user);
        token1.approve(spender1, 1000e18);
        token1.approve(spender2, type(uint256).max);
        token2.approve(spender1, 500e18);
        vm.stopPrank();
    }

    function testBatchAllowance() public {
        PanicRevoke.RevokeTarget[] memory targets = new PanicRevoke.RevokeTarget[](3);
        targets[0] = PanicRevoke.RevokeTarget(address(token1), spender1);
        targets[1] = PanicRevoke.RevokeTarget(address(token1), spender2);
        targets[2] = PanicRevoke.RevokeTarget(address(token2), spender1);

        uint256[] memory allowances = revoker.batchAllowance(user, targets);

        assertEq(allowances[0], 1000e18);
        assertEq(allowances[1], type(uint256).max);
        assertEq(allowances[2], 500e18);
    }

    function testCanRevokeReturnsTrue() public {
        assertTrue(revoker.canRevoke(user, address(token1), spender1));
    }

    function testCanRevokeReturnsFalseForZeroAllowance() public {
        // Revoke first
        vm.prank(user);
        token1.approve(spender1, 0);
        assertFalse(revoker.canRevoke(user, address(token1), spender1));
    }

    function testEncodeRevoke() public {
        (address target, bytes memory data) = revoker.encodeRevoke(address(token1), spender1);
        assertEq(target, address(token1));
        // The calldata should be approve(spender1, 0)
        bytes memory expected = abi.encodeCall(IERC20.approve, (spender1, 0));
        assertEq(data, expected);
    }

    function testBatchAllowanceEmpty() public {
        uint256[] memory allowances = revoker.batchAllowance(user, new PanicRevoke.RevokeTarget[](0));
        assertEq(allowances.length, 0);
    }
}
