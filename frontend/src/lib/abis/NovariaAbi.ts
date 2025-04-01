export const novariaAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "_WBTC", type: "address", internalType: "address" },
      { name: "_NOVA", type: "address", internalType: "address" },
      { name: "_excahngeRouter", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "EXCHANGE_ROUTER",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "NOVA",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "WBTC",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createOrder",
    inputs: [
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "collateralToken", type: "address", internalType: "address" },
      { name: "leverage", type: "uint256", internalType: "uint256" },
      { name: "isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "payable",
  },
]
