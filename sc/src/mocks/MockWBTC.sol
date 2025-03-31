// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockWBTC is ERC20 {
    constructor() ERC20("WBTC", "WBTC") {
        _mint(msg.sender, 1_028e18);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
