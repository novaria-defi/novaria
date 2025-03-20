// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BridgeLiberiChain {
    address public owner;
    mapping(address => uint256) public ptBalances;
    mapping(address => uint256) public ytBalances;

    event TokenMinted(address indexed user, uint256 amount, string tokenType);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function mintToken(address user, uint256 amount, string memory tokenType) public onlyOwner {
        if (keccak256(abi.encodePacked(tokenType)) == keccak256("PT")) {
            ptBalances[user] += amount;
        } else if (keccak256(abi.encodePacked(tokenType)) == keccak256("YT")) {
            ytBalances[user] += amount;
        }

        emit TokenMinted(user, amount, tokenType);
    }
}
