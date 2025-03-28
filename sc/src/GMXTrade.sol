// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IBaseOrderUtils.sol";
import "./NOVAToken.sol"; // Import the new NOVAToken contract
import "./Order.sol";

interface IExchangeRouter {
    function createOrder(
        IBaseOrderUtils.CreateOrderParams calldata params
    ) external payable returns (bytes32);
}

contract GMXTrade {
    IExchangeRouter public exchangeRouter;
    IERC20 public collateralToken;
    address public market;
    NOVAToken public novaToken; // Update the type of novaToken to NOVAToken


    event PositionOpened(address user, uint256 amount, bytes32 orderId);
    event NOVAMinted(address user, uint256 NOVAAmount);


    constructor(
        address _exchangeRouter,
        address _collateralToken,
        address _market,
        address _novaToken
    ) {
        exchangeRouter = IExchangeRouter(_exchangeRouter);
        collateralToken = IERC20(_collateralToken);
        market = _market;
        novaToken = NOVAToken(_novaToken); // Update the p[ afdshsinitialization of novaToken
    }

    function openPosition(
        uint256 collateralAmount,
        uint256 leverage,
        uint256 minOut,
        uint256 executionFee
    ) external returns (bytes32) {
        require(collateralAmount > 0, "Invalid collateral amount");

        collateralToken.transferFrom(
            msg.sender,
            address(this),
            collateralAmount
        );
        collateralToken.approve(address(exchangeRouter), collateralAmount);

        IBaseOrderUtils.CreateOrderParams memory orderParams = IBaseOrderUtils.CreateOrderParams({
            addresses: IBaseOrderUtils.CreateOrderParamsAddresses({
                receiver: msg.sender,
                cancellationReceiver: msg.sender,
                callbackContract: address(0),
                uiFeeReceiver: address(0),
                market: market,
                initialCollateralToken: address(collateralToken),
                swapPath: new address[](0)
            }),
            numbers: IBaseOrderUtils.CreateOrderParamsNumbers({
                sizeDeltaUsd: collateralAmount * leverage,
                initialCollateralDeltaAmount: collateralAmount,
                triggerPrice: 0,
                acceptablePrice: 0,
                executionFee: executionFee,
                callbackGasLimit: 200000,
                minOutputAmount: minOut,
                validFromTime: 0
            }),
    // orderType: OrderType.MarketIncrease, 
    orderType:Order.OrderType.MarketIncrease, 
    decreasePositionSwapType: Order.DecreasePositionSwapType.NoSwap,
            isLong: true,
            shouldUnwrapNativeToken: false,
            autoCancel: false,
            referralCode: bytes32(0)
        });
        // Mint 0.1 NOVA for each unit of collateral deposited
        uint256 novaMintAmount = collateralAmount / 10;
        // properly mint novaToken 
        novaToken.mint(msg.sender, novaMintAmount);
        emit NOVAMinted(msg.sender, novaMintAmount);

        // Create order
        bytes32 orderId = exchangeRouter.createOrder{value: executionFee}(orderParams);
        emit PositionOpened(msg.sender, collateralAmount, orderId);
        return orderId;
    }
}
