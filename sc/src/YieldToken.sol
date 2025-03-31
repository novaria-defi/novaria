// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {PTNova} from "./PrincipleToken.sol";

contract YTNova is ERC20 {
    address public principleToken;

    constructor(address _principleToken) ERC20("YTNova", "YT") {
        principleToken = _principleToken;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == principleToken, "Only principle token can mint yield token");
        _mint(to, amount);
    }

    function balanceOf(address account) public view override returns (uint256) {
        return super.balanceOf(account);
    }

    function _update(address from, address to, uint256 value) internal override {
        super._update(from, to, value);
    }
}
