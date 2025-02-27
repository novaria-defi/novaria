export const wagmiContractConfig = {
  address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // usdc arbitrum
  abi: [
    {
      type: 'function',
      name: 'balanceOf',
      stateMutability: 'view',
      inputs: [{ type: 'address' }],
      outputs: [{ type: 'uint256' }],
    },
    {
      type: 'function',
      name: 'totalSupply',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: 'supply', type: 'uint256' }],
    },
  ],
} as const