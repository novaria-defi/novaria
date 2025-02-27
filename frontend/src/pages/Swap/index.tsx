// import { config } from "@/lib/config";
// import { useBalance } from "@/hooks/useBalance";
// import { wagmiContractConfig } from "@/lib/wagmiContractConfig";
// import { HexAddress } from "@/types";
// import { useAccount } from "wagmi";

import ArrowSwapIcon from "@/components/icon/ArrowSwapIcon"
import ClockIcon from "@/components/icon/ClockIcon"
import FuelIcon from "@/components/icon/FuelIcon"
import { Input, NovariaTokenLogo, WBTCTokenLogo } from "@/components/ui/Input"
import Tabs from "@/components/ui/Tabs"
import { useState } from "react"

export const Swap = () => {
  // const { address } = useAccount();
  // const { balance, error } = useBalance(
  //   address as HexAddress,
  //   wagmiContractConfig.address
  // );

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  const [tabValue, setTabValue] = useState<"Buy" | "Sell">("Buy")
  const [tokenType, setTokenType] = useState<"PT" | "YT">("PT")

  return (
    <>
      <div className="border-2 font-bold rounded-xl flex gap-1  w-full mt-12 overflow-visible">
        {["PT", "YT"].map((tab) => (
          <button
            key={tab}
            className={`py-1.5 flex-1 rounded-xl relative z-10 cursor-pointer ${
              tab === tokenType
                ? "font-bold transition-transform duration-300 bg-turquoise-900  border-2 scale-y-110 scale-x-[101%]"
                : ""
            }`}
            onClick={() => {
              setTokenType(tab as "PT" | "YT")
            }}>
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <div className="rounded-3xl p-5 flex flex-col items-center justify-center bg-zinc-900">
          <div className="w-full mb-4">
            <Tabs
              tabs={["Buy", "Sell"]}
              onChangeTabs={(value) => {
                setTabValue(value)
              }}
            />
          </div>

          <div>
            <div className="text-start w-full text-lg font-semibold mb-2">
              Input
            </div>
            {tabValue == "Buy" ? (
              <Input icon={<WBTCTokenLogo />} />
            ) : (
              <Input icon={<NovariaTokenLogo type={tokenType} />} />
            )}
          </div>

          <div className="bg-turquoise-100 text-black rounded-full p-2 mt-6">
            <ArrowSwapIcon />
          </div>

          <div className="text-start w-full text-lg font-semibold mb-2">
            Output
          </div>
          {tabValue == "Buy" ? (
            <Input icon={<NovariaTokenLogo type={tokenType} />} />
          ) : (
            <Input icon={<WBTCTokenLogo />} />
          )}

          <div className="w-full mt-6">
            <div className="p-2 w-full rounded-2xl flex items-center justify-between">
              <span className="flex gap-2">
                <ClockIcon />
                <p>Est. Processing Time</p>
              </span>

              <p>~5 s</p>
            </div>
            <div className="p-2 w-full rounded-2xl flex items-center justify-between">
              <span className="flex gap-2">
                <FuelIcon />
                <p>Network Fee</p>
              </span>

              <p>0.001</p>
            </div>
          </div>
          <button className="mt-4 w-full bg-main hover:bg-main/90 text-black py-2 rounded-lg lg:text-lg text-md font-bold">
            Swap
          </button>
        </div>
      </div>
    </>
  )
}
