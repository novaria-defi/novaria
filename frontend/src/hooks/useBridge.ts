import { useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import {
  ARBITRUM_SEPOLIA_CHAIN_ID,
  LIBERICHAIN_CHAIN_ID,
  INTENT_SENDER_ADDRESS,
  YIELD_TOKEN_ADDRESS,
} from "@/utils/constants"
import { IntentSenderAbi } from "@/lib/abis/IntentSenderAbi"

export const useBridge = () => {
  const TOKEN_ADDRESS = YIELD_TOKEN_ADDRESS
  const ORIGIN_CHAIN_ID = ARBITRUM_SEPOLIA_CHAIN_ID
  const DESTINATION_CHAIN_ID = LIBERICHAIN_CHAIN_ID
  const DEADLINE = Math.floor(Date.now() / 1000) + 3600

  const {
    data: bridgeHash,
    isPending: isBridgePending,
    writeContract: writeBridge,
  } = useWriteContract()

  const { isLoading: isBridgeConfirming, isSuccess: isBridgeConfirmed } =
    useWaitForTransactionReceipt({
      hash: bridgeHash,
    })

  const handleBridge = async (amount: string, minReceived: string) => {
    try {
      const tx = await writeBridge({
        abi: IntentSenderAbi,
        address: INTENT_SENDER_ADDRESS,
        functionName: "submitIntent",
        args: [
          TOKEN_ADDRESS,
          BigInt(amount),
          BigInt(ORIGIN_CHAIN_ID),
          BigInt(DESTINATION_CHAIN_ID),
          BigInt(DEADLINE),
          BigInt(minReceived),
        ],
      })

      while (!isBridgeConfirmed) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    bridgeHash,
    isBridgePending,
    isBridgeConfirming,
    isBridgeConfirmed,
    handleBridge,
  }
}
