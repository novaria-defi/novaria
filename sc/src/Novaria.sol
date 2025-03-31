// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IBaseOrderUtils.sol";
import "./NOVAToken.sol"; // Import the new NOVAToken contract
import "./Order.sol";

interface IERC20Decimals {
    function decimals() external view returns (uint8);
}

interface INOVAToken {
    function mint(address to, uint256 amount) external;
}

contract Novaria {
    address public WBTC;
    address public NOVA;

    address public EXCHANGE_ROUTER;

    constructor (address _WBTC, address _NOVA, address _excahngeRouter) {
        EXCHANGE_ROUTER = _excahngeRouter;
        WBTC = _WBTC;
        NOVA = _NOVA;
    }

    function createOrder( 
        uint256 amount,
        address collateralToken,
        uint256 leverage,
        bool isLong
    ) public payable returns (bytes32) {
        IERC20(collateralToken).approve(address(EXCHANGE_ROUTER), amount);
        IERC20(collateralToken).transferFrom(msg.sender, address(this), amount);


        address[] memory swapPaths = new address[](1);
        uint256 sizeDeltaUsd = amount * leverage * (10 ** (30 - IERC20Decimals(collateralToken).decimals()));

        IBaseOrderUtils.CreateOrderParams memory params = IBaseOrderUtils.CreateOrderParams({
            addresses: IBaseOrderUtils.CreateOrderParamsAddresses({
                receiver: address(this),
                cancellationReceiver: address(0),
                callbackContract: address(0),
                uiFeeReceiver: 0xff00000000000000000000000000000000000001,
                market: 0x39857B73EcD9846C4aC31371AC42158FcC704023,
                initialCollateralToken: collateralToken,
                swapPath: swapPaths
            }),
            numbers: IBaseOrderUtils.CreateOrderParamsNumbers({
                sizeDeltaUsd: sizeDeltaUsd,
                initialCollateralDeltaAmount: 0,
                triggerPrice: 10,
                acceptablePrice: 0,
                executionFee: msg.value,
                callbackGasLimit: 0,
                minOutputAmount: 0,
                validFromTime: 0
            }),
            orderType: Order.OrderType.MarketIncrease,
            decreasePositionSwapType: Order.DecreasePositionSwapType.NoSwap,
            isLong: isLong,
            shouldUnwrapNativeToken: false,
            autoCancel: false,
            referralCode: bytes32(0)
        });

        bytes32 positionId = IBaseOrderUtils(EXCHANGE_ROUTER).createOrder(params);


        // mint NOVA
        INOVAToken(NOVA).mint(msg.sender, amount * 0.1 ether); // Ensure the amount is in the correct units
        return positionId;
    }
}