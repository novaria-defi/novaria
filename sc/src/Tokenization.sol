// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// Token NOVA
contract NOVA is ERC20 {
    constructor() ERC20("NOVA", "NOVA") {
        // Mint 1,000,000 NOVA (dengan 18 decimals)
        _mint(msg.sender, 1e18);
    }
}

// PT NOVA Token
contract PTNova is ERC20 {
    constructor() ERC20("PT NOVA", "ptNOVA") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

// YT NOVA Token
contract YTNova is ERC20 {
    constructor() ERC20("YT NOVA", "ytNOVA") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}


contract Tokenization is Ownable {
    uint256 public constant NOVA_AMOUNT = 50_000 * 1e18;  // 50,000 NOVA
    uint256 public constant FUNDING_RATE = 10;           // 10% fixed rate

    NOVA public novaToken;
    PTNova public ptNova;
    YTNova public ytNova;

    constructor(address _novaToken, address _ptNova, address _ytNova) Ownable(msg.sender) {
        novaToken = NOVA(_novaToken);
        ptNova = PTNova(_ptNova);
        ytNova = YTNova(_ytNova);
    }

    function tokenizeNOVA() external {
        // transfer NOVA from user to this contract
        novaToken.transferFrom(msg.sender, address(this), NOVA_AMOUNT);

        // Calculate PT and YT amounts (tanpa decimals)
        uint256 ptAmount = NOVA_AMOUNT;  // 50,000 NOVA
        uint256 ytAmount = (ptAmount * FUNDING_RATE) / 100;  // 5,000 NOVA (10%)

        // Mint PT and YT
        ptNova.mint(msg.sender, ptAmount);
        ytNova.mint(msg.sender, ytAmount);
    }
}