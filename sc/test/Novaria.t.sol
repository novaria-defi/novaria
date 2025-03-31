// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Novaria} from "src/Novaria.sol";
import {NOVAToken} from "src/NOVAToken.sol";
import {MockERC20} from "src/mocks/MockERC20.sol";
import {MockGMX} from "src/mocks/MockGMX.sol";

contract NovariaTest is Test {
    Novaria public novaria;
    NOVAToken public novaToken;
    MockERC20 public mockCollateral;
    MockGMX public mockGMX;

    address public owner = makeAddr("owner");
    address public user = makeAddr("user");
    uint256 public constant COLLATERAL_AMOUNT = 1e18; // 1 token
    uint256 public constant LEVERAGE = 2;
    uint256 public constant MIN_OUT = 0;
    uint256 public constant EXECUTION_FEE = 0.01e18; // 0.01 ETH

    function setUp() public {
        // Deploy mock contracts
        novaToken = new NOVAToken();
        mockCollateral = new MockERC20();
        mockGMX = new MockGMX();

        // Deploy Novaria contract
        novaria = new Novaria(
            address(mockCollateral),  // WBTC
            address(novaToken),  // NOVA
            address(mockGMX)  // EXCHANGE_ROUTER
        );

        // Give test accounts ETH
        deal(user, 100 ether);
        deal(address(this), 100 ether);
        deal(address(mockCollateral), 100 ether);
        deal(address(novaToken), 100 ether);
        deal(address(novaria), 100 ether);

        // Mint collateral to user
        mockCollateral.mint(user, COLLATERAL_AMOUNT * 10);
    }

    function test_openPosition() public {
        // Start prank as user
        vm.startPrank(user);

        // Approve Novaria to spend collateral
        mockCollateral.approve(address(novaria), COLLATERAL_AMOUNT);

        // Try to open position
        bytes32 orderId = novaria.createOrder{
            value: EXECUTION_FEE
        }(
            COLLATERAL_AMOUNT,
            address(mockCollateral),
            LEVERAGE,
            true
        );

        // Log the order ID
        console.log("Order ID:");
        console.logBytes32(orderId);

        // Verify NOVA tokens were minted
        uint256 expectedNovaAmount = COLLATERAL_AMOUNT / 10;
        assertEq(novaToken.balanceOf(user), expectedNovaAmount);

        vm.stopPrank();
    }

    function test_openPosition_InsufficientApproval() public {
        // Try to open position without approval
        vm.startPrank(user);
        vm.expectRevert();
        novaria.createOrder{
            value: EXECUTION_FEE
        }(
            COLLATERAL_AMOUNT,
            address(mockCollateral),
            LEVERAGE,
            true
        );
        vm.stopPrank();
    }

    function test_openPosition_InsufficientCollateral() public {
        // Try to open position with insufficient collateral
        vm.startPrank(user);
        mockCollateral.approve(address(novaria), COLLATERAL_AMOUNT);
        vm.expectRevert();
        novaria.createOrder{
            value: EXECUTION_FEE
        }(
            COLLATERAL_AMOUNT * 2,
            address(mockCollateral),
            LEVERAGE,
            true
        );
        vm.stopPrank();
    }

    function test_openPosition_InsufficientExecutionFee() public {
        // Try to open position with insufficient execution fee
        vm.startPrank(user);
        mockCollateral.approve(address(novaria), COLLATERAL_AMOUNT);
        vm.expectRevert();
        novaria.createOrder{
            value: 0
        }(
            COLLATERAL_AMOUNT,
            address(mockCollateral),
            LEVERAGE,
            true
        );
        vm.stopPrank();
    }

    function test_openPosition_Reentrancy() public {
        // Deploy a malicious contract that attempts to re-enter
        ReentrancyAttacker attacker = new ReentrancyAttacker(
            address(mockCollateral),
            address(novaria),
            address(novaToken)
        );

        // Transfer collateral to attacker
        vm.startPrank(owner);
        mockCollateral.mint(address(attacker), COLLATERAL_AMOUNT);
        vm.stopPrank();

        // Approve from attacker
        vm.startPrank(address(attacker));
        mockCollateral.approve(address(novaria), COLLATERAL_AMOUNT);

        // Should not revert due to reentrancy guard
        novaria.createOrder{
            value: EXECUTION_FEE
        }(
            COLLATERAL_AMOUNT,
            address(mockCollateral),
            LEVERAGE,
            true
        );

        vm.stopPrank();
    }

}
    // Helper contract for reentrancy testing
    contract ReentrancyAttacker {
        MockERC20 public collateralToken;
        Novaria public novaria;
        NOVAToken public novaToken;

        constructor(
            address _collateralToken,
            address _novaria,
            address _novaToken
        ) {
            collateralToken = MockERC20(_collateralToken);
            novaria = Novaria(_novaria);
            novaToken = NOVAToken(_novaToken);
        }

        // Fallback function that attempts to re-enter
        receive() external payable {
            if (address(novaria).balance >= 1e18) {
                novaria.createOrder{
                    value: 1e18
                }(
                    1e18,
                    address(collateralToken),
                    2,
                    true
                );
            }
        }
    }
