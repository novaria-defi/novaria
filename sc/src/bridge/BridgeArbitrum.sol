// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BridgeArbitrum {
    address public owner;
    mapping(address => uint256) public ptBalances;
    mapping(address => uint256) public ytBalances;

    event BridgeInitiated(address indexed user, uint256 amount, string tokenType);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function bridgeToken(uint256 amount, string memory tokenType) public {
        require(amount > 0, "Amount must be greater than 0");

        if (keccak256(abi.encodePacked(tokenType)) == keccak256("PT")) {
            require(ptBalances[msg.sender] >= amount, "Insufficient PT balance");
            ptBalances[msg.sender] -= amount;
        } else if (keccak256(abi.encodePacked(tokenType)) == keccak256("YT")) {
            require(ytBalances[msg.sender] >= amount, "Insufficient YT balance");
            ytBalances[msg.sender] -= amount;
        }

        emit BridgeInitiated(msg.sender, amount, tokenType);
    }

    function depositToken(uint256 amount, string memory tokenType) public {
        if (keccak256(abi.encodePacked(tokenType)) == keccak256("PT")) {
            ptBalances[msg.sender] += amount;
        } else if (keccak256(abi.encodePacked(tokenType)) == keccak256("YT")) {
            ytBalances[msg.sender] += amount;
        }
    }
}
