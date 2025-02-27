import { PRINCIPLE_TOKEN_ADDRESS, YIELD_TOKEN_ADDRESS } from "@/utils/constants"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import clsx from "clsx"
import { useAccount, useReadContract } from "wagmi"
import mockErc20 from "@/data/mockERC20.json"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const CustomButton = (props: ButtonProps) => {
  const { children, className, ...rest } = props
  return (
    <div className="relative group w-fit font-semibold">
      <span className="blur group-hover:opacity-50 absolute inset-0.5 bg-teal-100 z-[-2] rounded-full opacity-20 font-semibold"></span>
      <button
        {...rest}
        type="button"
        className={clsx(
          className,
          "rounded-full bg-teal-800 text-teal-100 group-hover:bg-transparent px-5 py-1.5 text-center relative overflow-hidden transition-colors duration-300 cursor-pointer group-hover:text-zinc-800"
        )}
      >
        {children}
        <span
          aria-hidden="true"
          className="blur-sm absolute inset-0 z-[-1] bg-gradient-to-r from-teal-500 to-teal-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-400"
        ></span>
      </button>
    </div>
  )
}

export const ConnectWalletButton = () => {
  const { address } = useAccount()
  const { data: ptBalance } = useReadContract({
    abi: mockErc20,
    address: PRINCIPLE_TOKEN_ADDRESS,
    functionName: "balanceOf",
    args: [address],
  })
  const { data: ytBalance } = useReadContract({
    abi: mockErc20,
    address: YIELD_TOKEN_ADDRESS,
    functionName: "balanceOf",
    args: [address],
  })
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading"
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated")
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {authenticationStatus == "loading" && "Loading..."}
            {(() => {
              if (!connected) {
                return (
                  <CustomButton onClick={openConnectModal} type="button">
                    Connect Wallet
                  </CustomButton>
                )
              }
              if (chain.unsupported) {
                return (
                  <CustomButton onClick={openChainModal} type="button">
                    Wrong Network
                  </CustomButton>
                )
              }
              return (
                <div className="flex gap-4 items-center text-sm">
                  <button
                    // onClick={openChainModal}
                    className="relative bg-zinc-800 text-teal-200 cursor-pointer font-semibold flex items-center gap-2 rounded-full border border-teal-600 px-4 py-2"
                  >
                    {`PT ${Number(ptBalance)} / YT ${Number(ytBalance)}`}
                  </button>
                  {/* <button
                    onClick={openChainModal}
                    className="relative bg-zinc-800 text-teal-200 cursor-pointer font-semibold flex items-center gap-2 rounded-full border border-teal-600 px-4 py-2"
                  >
                    {chain.hasIcon && (
                      <div className="size-5 overflow-hidden rounded-full">
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            className="size-5"
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button> */}

                  <div className="bg-zinc-800 flex gap-2 z-[20] items-center p-1 border border-teal-600 rounded-full">
                    <span className="text-white font-semibold ml-2">
                      {account.displayBalance ? ` ${account.displayBalance}` : "No Balance"}
                    </span>

                    <CustomButton className="bg-red-500" onClick={openAccountModal}>
                      {account.displayName}
                    </CustomButton>
                  </div>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
