import { createConfig, http } from "wagmi"
import { type Chain } from "viem"
import { mainnet, sepolia } from "viem/chains"

export const rise = {
  id: 11155931,
  name: "Rise Sepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://testnet.riselabs.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://testnet-explorer.riselabs.xyz",
    },
  },
} as const satisfies Chain

export const config = createConfig({
  chains: [rise, mainnet, sepolia],
  transports: {
    [rise.id]: http(),
    [mainnet.id]: http("https://mainnet.example.com"),
    [sepolia.id]: http("https://sepolia.example.com"),
  },
})
