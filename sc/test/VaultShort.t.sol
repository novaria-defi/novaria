// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {VaultShort} from "src/VaultShort.sol";
import {MockERC20} from "src/mocks/MockERC20.sol";

contract VaultShortTest is Test {
    VaultShort public vaultShort;
    MockERC20 public mockCollateral;
    address public owner = msg.sender;
    address public user = makeAddr("user");
    uint256 public constant DEPOSIT_AMOUNT = 1e18; // 1 token

    function setUp() public {
        // Deploy mock collateral token (WBTC)
        mockCollateral = new MockERC20();
        
        // Deploy VaultShort
        vaultShort = new VaultShort();

        // Mint some collateral tokens to user
        mockCollateral.mint(user, DEPOSIT_AMOUNT * 10);
        mockCollateral.approve(address(vaultShort), DEPOSIT_AMOUNT * 10);
    }

    function test_deposit() public {
        vm.startPrank(user);

        // Approve vault to spend collateral
        mockCollateral.approve(address(vaultShort), DEPOSIT_AMOUNT);

        // Deposit with 0.1 ETH execution fee
        bytes32 positionId = vaultShort.deposit{value: 0.1 ether}(DEPOSIT_AMOUNT, address(mockCollateral));

        // Verify position ID is not zero
        assertEq(positionId, bytes32(0), "Position ID should not be zero");

        // Verify collateral was transferred
        uint256 vaultBalance = mockCollateral.balanceOf(address(vaultShort));
        assertEq(vaultBalance, DEPOSIT_AMOUNT, "Vault should have received collateral");

        // Verify user's balance decreased
        uint256 userBalance = mockCollateral.balanceOf(user);
        assertEq(userBalance, DEPOSIT_AMOUNT * 9, "User's balance should be reduced");

        vm.stopPrank();
    }

    function test_deposit_InsufficientCollateral() public {
        vm.startPrank(user);

        // Try to deposit more than user has
        uint256 largeAmount = DEPOSIT_AMOUNT * 100;
        vm.expectRevert();
        vaultShort.deposit{value: 0.1 ether}(largeAmount, address(mockCollateral));

        vm.stopPrank();
    }

    function test_deposit_InsufficientApproval() public {
        vm.startPrank(user);

        // Approve less than required amount
        mockCollateral.approve(address(vaultShort), DEPOSIT_AMOUNT - 1);

        // Try to deposit
        vm.expectRevert();
        vaultShort.deposit{value: 0.1 ether}(DEPOSIT_AMOUNT, address(mockCollateral));

        vm.stopPrank();
    }

    function test_deposit_InsufficientExecutionFee() public {
        vm.startPrank(user);

        // Approve correct amount
        mockCollateral.approve(address(vaultShort), DEPOSIT_AMOUNT);

        // Try to deposit with insufficient execution fee
        vm.expectRevert();
        vaultShort.deposit{value: 0.01 ether}(DEPOSIT_AMOUNT, address(mockCollateral));

        vm.stopPrank();
    }

    function test_deposit_Reentrancy() public {
        // Deploy a malicious contract that attempts to re-enter
        ReentrancyAttacker attacker = new ReentrancyAttacker(address(mockCollateral), address(vaultShort));

        // Transfer collateral to attacker
        vm.startPrank(owner);
        mockCollateral.mint(address(attacker), DEPOSIT_AMOUNT);
        vm.stopPrank();

        // Approve from attacker
        vm.startPrank(address(attacker));
        mockCollateral.approve(address(vaultShort), DEPOSIT_AMOUNT);

        // Should not revert due to reentrancy guard
        vaultShort.deposit{value: 0.1 ether}(DEPOSIT_AMOUNT, address(mockCollateral));

        vm.stopPrank();
    }
}

// Helper contract for reentrancy testing
contract ReentrancyAttacker {
    MockERC20 public collateral;
    VaultShort public vaultShort;

    constructor(address _collateral, address _vaultShort) {
        collateral = MockERC20(_collateral);
        vaultShort = VaultShort(_vaultShort);
    }

    function attack() external payable {
        collateral.approve(address(vaultShort), 1e18);
        vaultShort.deposit{value: 0.1 ether}(1e18, address(collateral));
    }

    receive() external payable {
        // Try to re-enter if we still have collateral
        if (collateral.balanceOf(address(this)) > 0) {
            vaultShort.deposit{value: 0.1 ether}(1e18, address(collateral));
        }
    }
}
