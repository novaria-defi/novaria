// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Tokenization} from "src/Tokenization.sol";
import {NOVA} from "src/Tokenization.sol";
import {PTNova} from "src/Tokenization.sol";
import {YTNova} from "src/Tokenization.sol";

contract TokenizationTest is Test {
    NOVA public nova;
    PTNova public ptNova;
    YTNova public ytNova;
    Tokenization public tokenization;

    address public owner = msg.sender;
    address public user = makeAddr("user");

    uint256 public constant NOVA_AMOUNT = 50_000 * 1e18;  // 50,000 NOVA

    function setUp() public {
        // Deploy contracts
        vm.startPrank(owner);

        nova = new NOVA();
        ptNova = new PTNova();
        ytNova = new YTNova();
        tokenization = new Tokenization(address(nova), address(ptNova), address(ytNova));

        // Transfer NOVA tokens to user for testing
        nova.transfer(user, NOVA_AMOUNT);

        vm.stopPrank();
    }

    function test_tokenizeNOVA() public {
        vm.startPrank(user);

        // Approve NOVA tokens
        nova.approve(address(tokenization), NOVA_AMOUNT);

        // Tokenize NOVA
        tokenization.tokenizeNOVA();

        // Check balances after tokenization
        uint256 novaBalance = nova.balanceOf(user);
        uint256 ptBalance = ptNova.balanceOf(user);
        uint256 ytBalance = ytNova.balanceOf(user);

        // Verify NOVA was transferred to contract
        assertEq(novaBalance, 0, "User should have 0 NOVA after tokenization");
        assertEq(nova.balanceOf(address(tokenization)), NOVA_AMOUNT, "Contract should have received NOVA");

        // Verify PT and YT tokens were minted correctly
        assertEq(ptBalance, NOVA_AMOUNT, "PT balance should be equal to NOVA amount");
        assertEq(ytBalance, (NOVA_AMOUNT * 10) / 100, "YT balance should be 10% of NOVA amount");

        vm.stopPrank();
    }

    function test_tokenizeNOVA_InsufficientApproval() public {
        vm.startPrank(user);

        // Approve less than required amount
        nova.approve(address(tokenization), NOVA_AMOUNT - 1);

        // Should revert due to insufficient approval
        vm.expectRevert();
        tokenization.tokenizeNOVA();

        vm.stopPrank();
    }

    function test_tokenizeNOVA_InsufficientBalance() public {
        vm.startPrank(user);

        // Transfer NOVA back to owner
        nova.transfer(owner, NOVA_AMOUNT);

        // Approve full amount but user has no balance
        nova.approve(address(tokenization), NOVA_AMOUNT);

        // Should revert due to insufficient balance
        vm.expectRevert();
        tokenization.tokenizeNOVA();

        vm.stopPrank();
    }

    function test_tokenizeNOVA_Reentrancy() public {
        // Deploy a malicious contract that attempts to re-enter
        ReentrancyAttacker attacker = new ReentrancyAttacker(address(nova), address(tokenization));

        // Transfer NOVA to attacker
        vm.startPrank(owner);
        nova.transfer(address(attacker), NOVA_AMOUNT);
        vm.stopPrank();

        // Approve from attacker
        vm.startPrank(address(attacker));
        nova.approve(address(tokenization), NOVA_AMOUNT);

        // Should not revert due to reentrancy guard
        tokenization.tokenizeNOVA();

        vm.stopPrank();
    }
}

// Helper contract for reentrancy testing
contract ReentrancyAttacker {
    NOVA public nova;
    Tokenization public tokenization;

    constructor(address _nova, address _tokenization) {
        nova = NOVA(_nova);
        tokenization = Tokenization(_tokenization);
    }

    function attack() external {
        nova.approve(address(tokenization), 50_000 * 1e18);
        tokenization.tokenizeNOVA();
    }

    receive() external payable {
        // Try to re-enter if we still have NOVA
        if (nova.balanceOf(address(this)) > 0) {
            tokenization.tokenizeNOVA();
        }
    }
}