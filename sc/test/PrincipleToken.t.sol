// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {PrincipleToken} from "src/PrincipleToken.sol";
import {YieldToken} from "src/YieldToken.sol";
import {MockERC20} from "src/mocks/MockERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PrincipleTokenTest is Test {
    YieldToken public yieldToken;
    PrincipleToken public principleToken;
    MockERC20 public mockVault;

    address expectedYieldTokenAddress;
    address expectedPrincipleTokenAddress;

    function setUp() public {
        mockVault = new MockERC20();

        uint64 nonce = vm.getNonce(address(this));
        expectedYieldTokenAddress = computeCreateAddress(address(this), nonce);
        expectedPrincipleTokenAddress = computeCreateAddress(address(this), nonce + 1);

        yieldToken = new YieldToken(expectedPrincipleTokenAddress);
        vm.setNonce(address(this), nonce + 1);
        principleToken = new PrincipleToken(address(mockVault), expectedYieldTokenAddress);

        deal(address(mockVault), address(this), 100_000e18);
    }

    function test_deploy() public {
        assertEq(address(yieldToken), expectedYieldTokenAddress);
        assertEq(address(principleToken), expectedPrincipleTokenAddress);
    }

    function test_deposit() public {
        IERC20(address(mockVault)).approve(address(principleToken), 100e18);
        principleToken.deposit(100e18);

        console.log("balance of", principleToken.balanceOf(address(this)));
        console.log("balance of", yieldToken.balanceOf(address(this)));
    }
}
