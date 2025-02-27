// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {MockGTX} from "./mocks/MockGTX.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FundingVault is ERC20 {
    address public mockGTX;

    uint256 public positionId;

    address public token;

    constructor(address _mockGTX, address _token) ERC20("FundingVault", "FV") {
        mockGTX = _mockGTX;
        token = _token;
    }

    function totalAssets() public view returns (uint256) {
        MockGTX.CreateOrderParams memory params = MockGTX(mockGTX).getPosition(positionId);
        return params.sizeDeltaUsd;
    }

    function deposit(uint256 amount) external {
        uint256 shares = 0;
        if (totalSupply() == 0) {
            shares = amount;
        } else {
            shares = (amount * totalSupply()) / totalAssets();
        }

        IERC20(token).transferFrom(msg.sender, address(this), amount);

        MockGTX.CreateOrderParams memory params = MockGTX.CreateOrderParams({
            market: token,
            initialCollateralToken: token,
            sizeDeltaUsd: amount,
            initialCollateralDeltaAmount: amount
        });

        // deposit collateral
        IERC20(token).approve(mockGTX, amount);
        MockGTX(mockGTX).sendTokens(token, amount);

        // create or increase position
        _createOrIncreasePosition(params);

        _mint(msg.sender, shares);
    }

    function withdraw(uint256 shares) external {
        require(shares <= balanceOf(msg.sender), "Not enough shares");

        uint256 amount = (shares * totalAssets()) / totalSupply();

        // withdraw collateral
        MockGTX(mockGTX).withdrawTokens(token, amount);

        // decrease position
        MockGTX(mockGTX).decreasePosition(positionId, amount);

        // transfer collateral
        IERC20(token).transfer(msg.sender, amount);

        _burn(msg.sender, shares);
    }

    function _createOrIncreasePosition(MockGTX.CreateOrderParams memory params) internal {
        // if position is 0 then initiate position
        if (positionId == 0) {
            uint256 _positionId = MockGTX(mockGTX).createOrder(params);
            positionId = _positionId;
        } else {
            MockGTX(mockGTX).increaseOrder(positionId, params.sizeDeltaUsd);
        }
    }
}
