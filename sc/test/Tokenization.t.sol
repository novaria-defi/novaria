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

        // check initial balances
        uint256 initialNovaBalance = nova.balanceOf(user);
        uint256 initialPtBalance = ptNova.balanceOf(user);
        uint256 initialYtBalance = ytNova.balanceOf(user);

        console.log("Nova balance: ", initialNovaBalance);
        console.log("PT Nova balance: ", initialPtBalance);
        console.log("YT Nova balance: ", initialYtBalance);

        vm.stopPrank();
    }
}