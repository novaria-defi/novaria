// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Test, console} from "forge-std/Test.sol";
import "forge-std/console.sol";
import {GMXTrade} from "src/GMXTrade.sol";
import {NOVAToken} from "src/NOVAToken.sol";
import {MockERC20} from "src/mocks/MockERC20.sol";
import {IBaseOrderUtils} from "src/interfaces/IBaseOrderUtils.sol";

contract GMXTradeTest is Test {
    GMXTrade public gmxTrade;
    NOVAToken public novaToken;
    MockERC20 public mockCollateral;
    address public owner = msg.sender;
    address public user = makeAddr("user");
    address public exchangeRouter = makeAddr("exchangeRouter");
    address public market = makeAddr("market");

    uint256 public constant COLLATERAL_AMOUNT = 1e18; // 1 token
    uint256 public constant LEVERAGE = 2;
    uint256 public constant MIN_OUT = 1e18;

    function setUp() public {
        // Deploy mock collateral token
        mockCollateral = new MockERC20();
        
        // Deploy NOVA token
        novaToken = new NOVAToken();

        // Deploy GMXTrade
        gmxTrade = new GMXTrade(
            exchangeRouter,      // _exchangeRouter
            address(mockCollateral), // _collateralToken
            market,             // _market
            address(novaToken)  // _novaToken
        );

        // Give test accounts ETH
        deal(user, 100 ether);
        deal(address(this), 100 ether);
        deal(address(mockCollateral), 100 ether);
        deal(address(novaToken), 100 ether);
        deal(address(gmxTrade), 100 ether);

        // Mint collateral to user
        mockCollateral.mint(user, COLLATERAL_AMOUNT * 10);
        mockCollateral.approve(address(gmxTrade), COLLATERAL_AMOUNT * 10);
    }

    function test_openPosition() public {
        // Set up test values
        uint256 EXECUTION_FEE = 0.0001e18; // 0.0001 ETH

        // Start prank as user
        vm.startPrank(user);

        // Approve GMXTrade to spend collateral
        mockCollateral.approve(address(gmxTrade), COLLATERAL_AMOUNT);

        // Try to open position
        bytes32 orderId = gmxTrade.openPosition(
            COLLATERAL_AMOUNT,
            LEVERAGE,
            MIN_OUT,
            EXECUTION_FEE
        );

        // // Log the order ID
        // console.log("Order ID:");
        // console.logBytes32(orderId);

        // // Verify NOVA tokens were minted
        // uint256 expectedNovaAmount = COLLATERAL_AMOUNT / 10;
        // assertEq(novaToken.balanceOf(user), expectedNovaAmount);

        vm.stopPrank();
    }

    function test_openPosition_InsufficientCollateral() public {
        // Try to open position with insufficient collateral
        vm.startPrank(user);
        mockCollateral.approve(address(gmxTrade), COLLATERAL_AMOUNT);
        vm.expectRevert();
        gmxTrade.openPosition(
            COLLATERAL_AMOUNT * 2,
            LEVERAGE,
            MIN_OUT,
            0.01e18
        );
        vm.stopPrank();
    }

    function test_openPosition_InsufficientApproval() public {
        // Try to open position without approval
        vm.expectRevert();
        gmxTrade.openPosition(
            COLLATERAL_AMOUNT,
            LEVERAGE,
            MIN_OUT,
            0.01e18
        );
    }

    function test_openPosition_InsufficientExecutionFee() public {
        // Try to open position with insufficient execution fee
        vm.startPrank(user);
        mockCollateral.approve(address(gmxTrade), COLLATERAL_AMOUNT);
        vm.expectRevert();
        gmxTrade.openPosition(
            COLLATERAL_AMOUNT,
            LEVERAGE,
            MIN_OUT,
            0
        );
        vm.stopPrank();
    }

    // function test_openPosition_Reentrancy() public {
    //     // Deploy a malicious contract that attempts to re-enter
    //     ReentrancyAttacker attacker = new ReentrancyAttacker(
    //         address(mockCollateral),
    //         address(gmxTrade),
    //         address(novaToken)
    //     );

    //     // Transfer collateral to attacker
    //     vm.startPrank(owner);
    //     mockCollateral.mint(address(attacker), COLLATERAL_AMOUNT);
    //     vm.stopPrank();

    //     // Approve from attacker
    //     vm.startPrank(address(attacker));
    //     mockCollateral.approve(address(gmxTrade), COLLATERAL_AMOUNT);

    //     // Should not revert due to reentrancy guard
    //     gmxTrade.openPosition(
    //         COLLATERAL_AMOUNT,
    //         LEVERAGE,
    //         MIN_OUT,
    //         0.01e18
    //     );

    //     vm.stopPrank();
    // }
}

// Helper contract for reentrancy testing
contract ReentrancyAttacker {
    MockERC20 public collateral;
    GMXTrade public gmxTrade;
    NOVAToken public novaToken;

    constructor(
        address _collateral,
        address _gmxTrade,
        address _novaToken
    ) {
        collateral = MockERC20(_collateral);
        gmxTrade = GMXTrade(_gmxTrade);
        novaToken = NOVAToken(_novaToken);
    }

    function attack() external payable {
        collateral.approve(address(gmxTrade), 1e18);
        gmxTrade.openPosition(
            1e18,
            2,
            1e18,
            0.01e18
        );
    }

    receive() external payable {
        // Try to re-enter if we still have collateral
        if (collateral.balanceOf(address(this)) > 0) {
            gmxTrade.openPosition(
                1e18,
                2,
                1e18,
                0.01e18
            );
        }
    }
}
