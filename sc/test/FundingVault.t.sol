// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {MockGTX} from "src/mocks/MockGTX.sol";
import {FundingVault} from "src/FundingVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FundingVaultTest is Test {
    MockGTX public mockGTX;
    FundingVault public fundingVault;

    address public token = 0xf1CeAFabFe0c541fe45Bcd2Ed391e8BE4105b66A;

    function setUp() public {
        vm.createSelectFork("https://testnet.riselabs.xyz");
        mockGTX = new MockGTX();
        fundingVault = new FundingVault(address(mockGTX), 0xf1CeAFabFe0c541fe45Bcd2Ed391e8BE4105b66A);
        deal(token, address(this), 100_000e18);
    }

    function test_deposit() public {
        IERC20(token).approve(address(fundingVault), 100e18);
        fundingVault.deposit(100);

        fundingVault.deposit(200);

        console.log("balance of", fundingVault.balanceOf(address(this)));
    }

    function test_withdraw() public {
        IERC20(token).approve(address(fundingVault), 100);
        fundingVault.deposit(100);

        fundingVault.withdraw(fundingVault.balanceOf(address(this)));

        console.log("balance of", fundingVault.balanceOf(address(this)));
    }
}
