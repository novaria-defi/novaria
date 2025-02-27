// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockGTX {
    struct CreateOrderParams {
        // Address parameters
        address market;
        address initialCollateralToken;
        uint256 sizeDeltaUsd;
        uint256 initialCollateralDeltaAmount;
    }

    uint256 currentOrderId;

    mapping(uint256 => CreateOrderParams) public positions;
    mapping(address => mapping(address => uint256)) public balances;

    function sendTokens(address _token, uint256 _amount) external {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        balances[msg.sender][_token] += _amount;
    }

    function withdrawTokens(address _token, uint256 _amount) external {
        require(balances[msg.sender][_token] >= _amount, "Insufficient balance");
        IERC20(_token).transfer(msg.sender, _amount);
        balances[msg.sender][_token] -= _amount;
    }

    function createOrder(CreateOrderParams memory _params) external returns (uint256) {
        currentOrderId++;
        positions[currentOrderId] = _params;
        return currentOrderId;
    }

    function increaseOrder(uint256 _orderId, uint256 amount) external {
        CreateOrderParams storage position = positions[_orderId];
        position.sizeDeltaUsd += amount;
    }

    function decreasePosition(uint256 _orderId, uint256 amount) external {
        CreateOrderParams storage position = positions[_orderId];
        position.sizeDeltaUsd -= amount;
    }

    function cancelOrder(uint256 _orderId) external {
        delete positions[_orderId];
    }

    function getPosition(uint256 _orderId) external view returns (CreateOrderParams memory) {
        return positions[_orderId];
    }

    function updatePositionSizeDeltaUsd(uint256 _orderId, uint256 _sizeDeltaUsd) external {
        CreateOrderParams storage position = positions[_orderId];
        position.sizeDeltaUsd = _sizeDeltaUsd;
    }
}
