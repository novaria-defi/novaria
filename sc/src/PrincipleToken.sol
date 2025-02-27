// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {YieldToken} from "./YieldToken.sol";

contract PrincipleToken is ERC20 {
    address public asset;

    uint256 public maturityDate;

    address public yieldToken;

    constructor(address _asset, address _yieldToken) ERC20("PrincipleToken", "PT") {
        asset = _asset;
        maturityDate = block.timestamp + 90 days;
        yieldToken = _yieldToken;
    }

    function deposit(uint256 amount) external {
        require(block.timestamp < maturityDate, "Matured!");
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        YieldToken(yieldToken).mint(msg.sender, amount);
        _mint(msg.sender, amount);
    }

    function redeem(uint256 amount) external {
        require(block.timestamp > maturityDate, "Maturity date not reached");

        _burn(msg.sender, amount);
        IERC20(asset).transfer(msg.sender, amount);
    }

    function updateYield(uint256 amount) external {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
    }
}
