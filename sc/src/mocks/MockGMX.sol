// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "../Order.sol"; // Ensure this path is correct based on your project structure;
import "../interfaces/IBaseOrderUtils.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

interface IERC20Decimals {
    function decimals() external view returns (uint8);
}
contract MockGMX is IBaseOrderUtils {
    // State variable to store the last created order parameters
    CreateOrderParams public lastCreatedOrderParams;

    // State variable to keep track of the current order ID
    uint256 private currentOrderId;
    mapping(uint256 => CreateOrderParams) public positions;

    // Event to log order creation
    event OrderCreated(
        uint256 indexed orderId,
        address indexed receiver,
        uint256 sizeDeltaUsd,
        uint256 triggerPrice,
        bool isLong,
        bytes32 referralCode
    );

    // Function to create an order (mock implementation)
    function createOrder(CreateOrderParams memory params) external payable returns (bytes32) {
        // Validate input parameters
        require(params.numbers.sizeDeltaUsd > 0, "Size must be greater than zero");
        require(params.numbers.triggerPrice > 0, "Trigger price must be greater than zero");
        require(params.addresses.receiver != address(0), "Receiver address cannot be zero");

        // Increment the order ID
        currentOrderId++;

        // Store the parameters for testing purposes
        lastCreatedOrderParams = params;
        positions[currentOrderId++] = params;

        // Emit an event to log the order creation
        emit OrderCreated(
            currentOrderId,
            params.addresses.receiver,
            params.numbers.sizeDeltaUsd,
            params.numbers.triggerPrice,
            params.isLong,
            params.referralCode
        );

        // Return the new order ID
        return bytes32(currentOrderId);
    }

    // Function to retrieve the last created order parameters
    function getLastCreatedOrderParams() external view returns (CreateOrderParams memory) {
        return lastCreatedOrderParams;
    }

    function sendTokens(address token, address receiver, uint256 amount) external override {
    IERC20(token).transfer(receiver, amount);
}

function sendWnt(address receiver, uint256 amount) external payable override {
    (bool success, ) = payable(receiver).call{value: amount}("");
    require(success, "ETH transfer failed");
}
}