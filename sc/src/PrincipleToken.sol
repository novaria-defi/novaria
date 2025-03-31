// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PTNova is ERC20 {
    address public asset;

    constructor(address _asset) ERC20("PTNova", "PTNOVA") {
        asset = _asset;
    }

    function deposit(uint256 amount) external {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);
    }

    function redeem(uint256 amount) external {
        _burn(msg.sender, amount);
        IERC20(asset).transfer(msg.sender, amount);
    }

    function updateYield(uint256 amount) external {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
    }
}
