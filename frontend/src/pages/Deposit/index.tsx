import { useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import mockErc20 from "@/data/mockERC20.json"
import mockVault from "@/data/mockVault.json"
import { Input, NovariaTokenLogo } from "@/components/ui/Input"
import ClockIcon from "@/components/icon/ClockIcon"
import FuelIcon from "@/components/icon/FuelIcon"
import { FUNDING_VAULT_ADDRESS, PRINCIPLE_TOKEN_ADDRESS } from "@/utils/constants"
import { useState } from "react"
import { ChartComponent } from "@/components/ui/ChartComponent"
import { toast } from "sonner"
import Preloader from "@/components/Preloader"

export const Deposit = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenPopup = (_: string) => {
    setIsOpen(true)
  }

  const handleClosePopup = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div className="flex flex-col gap-4 w-full px-8">
        <div className="flex flex-col gap-2 align-center text-white mt-10">
          <p className="text-2xl font-semibold">Make Your Shares Work as PT and YT</p>
          <div>
            <p className="text-xs text-white/50">
              Find stability in a world of fluctuating yields—no lock-up required.
            </p>
            <p className="text-xs text-white/50">
              Go long on yield or hedge your exposure—the choice is yours.
            </p>
          </div>
        </div>

        <div className="w-full">
          <Table handleOpenPopup={handleOpenPopup} />
        </div>
      </div>

      {isOpen && <PopupDetail handleClosePopup={handleClosePopup} />}
    </>
  )
}

interface PopupDetailProps {
  handleClosePopup: () => void
}

export const PopupDetail = ({ handleClosePopup }: PopupDetailProps) => {
  const { data: hash, isPending, writeContractAsync } = useWriteContract()

  const { isLoading, isSuccess: _isSuccess } = useWaitForTransactionReceipt({
    hash: hash,
  })

  const [input, setInput] = useState("")

  const handleApproveAndDeposit = async () => {
    await writeContractAsync({
      abi: mockErc20,
      address: FUNDING_VAULT_ADDRESS,
      functionName: "approve",
      args: [PRINCIPLE_TOKEN_ADDRESS, BigInt(100)],
    })
      .then(async () => {
        await writeContractAsync({
          abi: mockVault,
          address: PRINCIPLE_TOKEN_ADDRESS,
          functionName: "deposit",
          args: [BigInt(100)],
        })

        toast.success(`Success Deposit PT: 100 YT: 100`)
      })
      .catch(err => {
        console.error(err)
        toast.error("Errror Mint Token")
      })
  }

  return (
    <>
      {isLoading && <Preloader />}

      <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-black/70 flex flex-col items-center justify-center gap-4">
        <div className="w-[80%] h-max bg-zinc-900 p-5 rounded-lg">
          <div className="grid grid-cols-12 gap-4 h-full">
            <div className="col-span-4 flex items-center">
              <div className="rounded-3xl border border-white/20 p-5 flex flex-col gap-6 items-center justify-center mx-auto">
                <div>
                  <div className="text-start w-full text-lg font-semibold mb-2">Input</div>
                  <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    icon={<NovariaTokenLogo />}
                  />
                </div>

                <div>
                  <div className="text-start w-full text-lg font-semibold mb-2">Output</div>
                  <Input readOnly value={input} icon={<NovariaTokenLogo type="PT" />} />
                  <Input
                    readOnly
                    value={input}
                    icon={<NovariaTokenLogo type="YT" />}
                    className="mt-4"
                  />
                </div>

                <div className="w-full">
                  <div className="p-2 w-full rounded-2xl flex items-center justify-between">
                    <span className="flex gap-2 text-white/50">
                      <ClockIcon />
                      <p className="text-sm">Est. Processing Time</p>
                    </span>

                    <p className="text-sm">~5 s</p>
                  </div>
                  <div className="p-2 w-full rounded-2xl flex items-center justify-between">
                    <span className="flex gap-2 text-white/50">
                      <FuelIcon />
                      <p className="text-sm">Network Fee</p>
                    </span>

                    <p className="text-sm">0.001</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  {/* <button
                  className="border border-main/50 bg-main/10 px-4 py-2 rounded-lg text-sm text-white cursor-pointer hover:border-main hover:bg-main/40 transition-all disabled:opacity-50"
                  onClick={handleApprove}
                  disabled={!input || isPending}
                >
                  Approval
                </button> */}
                  <button
                    className="border border-main/50 bg-main/10 px-4 py-2 rounded-lg text-sm text-white cursor-pointer hover:border-main hover:bg-main/40 transition-all disabled:opacity-50"
                    onClick={handleApproveAndDeposit}
                    disabled={!input || isPending}
                  >
                    Deposit
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-8 flex flex-col gap-6">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <img
                    src="https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/2dae1fc4-645b-4278-9a45-e3708f9463da.svg"
                    alt="LBTC (Corn)"
                    className="size-9"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-semibold">LBTC (Corn)</p>
                    <p className="text-xs text-white/50">
                      LBTC (Corn) is a Bitcoin-pegged token on the Layer 2 Lightning Network,{" "}
                      <br></br>
                      enabling fast and low-cost BTC transactions.
                    </p>
                  </div>
                </div>
                <button
                  className="text-xs text-white hover:underline cursor-pointer"
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>
              </div>
              <ChartComponent
                data={[
                  { time: "2018-12-22", value: 10.51 },
                  { time: "2018-12-23", value: 11.11 },
                  { time: "2018-12-24", value: 12.02 },
                  { time: "2018-12-25", value: 13.32 },
                  { time: "2018-12-26", value: 14.17 },
                  { time: "2018-12-27", value: 15.89 },
                  { time: "2018-12-28", value: 16.46 },
                  { time: "2018-12-29", value: 17.92 },
                  { time: "2018-12-30", value: 18.68 },
                  { time: "2018-12-31", value: 22.67 },
                ]}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-red-400/50 p-4 flex items-center justify-between rounded-lg bg-red-950/10">
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">Liquidity</p>
                    <p className="text-xs text-white/50">$5.75M</p>
                  </div>
                  <p className="font-semibold text-sm text-red-400">-4.551%</p>
                </div>

                <div className="border border-main/50 p-4 flex items-center justify-between rounded-lg bg-main/10">
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">24H Volume</p>
                    <p className="text-xs text-white/50">$11,587</p>
                  </div>
                  <p className="font-semibold text-sm text-main">+120%</p>
                </div>

                <div className="border border-main/50 p-4 flex items-center justify-between rounded-lg bg-main/10">
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">Underlying APY</p>
                    <p className="text-xs text-white/50">3.767%</p>
                  </div>
                  <p className="font-semibold text-sm text-main">+0.6293%</p>
                </div>

                <div className="border border-red-400/50 p-4 flex items-center justify-between rounded-lg bg-red-950/10">
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">Implied APY</p>
                    <p className="text-xs text-white/50">3.789%</p>
                  </div>
                  <p className="font-semibold text-sm text-red-400">-0.1841%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface TableProps {
  handleOpenPopup: (mode: string) => void
}

export const Table = ({ handleOpenPopup }: TableProps) => {
  const items = [
    {
      id: "lbtc",
      label: "LBTC (Corn)",
      imgUrl:
        "https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/2dae1fc4-645b-4278-9a45-e3708f9463da.svg",
      date: "2025 Dec 31",
      liquidity: "$9.1M",
      leverage: "20x",
      fundingRate: "14.5%",
      fixedFundingRate: "20%",
      ytRate: "-5.842%",
      ytAmount: "$28.14",
      ptRate: "3.789%",
      ptAmount: "$2.283",
    },
    {
      id: "ethy",
      label: "ETH Yield",
      imgUrl:
        "https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/570f3075-22bd-498b-a489-d930d5741222.svg",
      date: "2025 Nov 30",
      liquidity: "$12.5M",
      leverage: "15x",
      fundingRate: "10.2%",
      fixedFundingRate: "18%",
      ytRate: "-3.921%",
      ytAmount: "$24.67",
      ptRate: "4.129%",
      ptAmount: "$3.145",
    },
    {
      id: "btcplus",
      label: "BTC+ Staking",
      imgUrl:
        "https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/58077c4d-c0ee-4412-909b-ae860bd74252.svg",
      date: "2025 Oct 15",
      liquidity: "$7.8M",
      leverage: "25x",
      fundingRate: "16.3%",
      fixedFundingRate: "22%",
      ytRate: "-6.410%",
      ytAmount: "$30.12",
      ptRate: "3.401%",
      ptAmount: "$2.019",
    },
    {
      id: "liq",
      label: "Liquid Bera",
      imgUrl:
        "https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/3a2ee3bb-c89e-45b9-b814-8285d98fa02e.svg",
      date: "2025 Sep 10",
      liquidity: "$5.3M",
      leverage: "12x",
      fundingRate: "9.8%",
      fixedFundingRate: "15%",
      ytRate: "-2.789%",
      ytAmount: "$18.67",
      ptRate: "5.125%",
      ptAmount: "$4.009",
    },
    {
      id: "usdtf",
      label: "USDT Farming",
      imgUrl:
        "https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/eec40602-0d7a-4be2-9f86-0fc70ab2e579.svg",
      date: "2026 Jan 20",
      liquidity: "$20.4M",
      leverage: "10x",
      fundingRate: "8.5%",
      fixedFundingRate: "12%",
      ytRate: "-1.923%",
      ytAmount: "$14.34",
      ptRate: "6.432%",
      ptAmount: "$5.781",
    },
    {
      id: "teth",
      label: "tETH",
      imgUrl:
        "https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/fa993241-8060-4e41-a24a-31d6bb3f25f7.svg",
      date: "2025 Aug 05",
      liquidity: "$6.7M",
      leverage: "18x",
      fundingRate: "12.7%",
      fixedFundingRate: "19%",
      ytRate: "-4.342%",
      ytAmount: "$22.54",
      ptRate: "4.651%",
      ptAmount: "$3.879",
    },
  ]

  return (
    <table className="table-auto w-full">
      <thead>
        <tr className="text-sm text-teal-500 tracking-wider">
          <th className="py-2 px-8 pl-0 font-light min-w-fit whitespace-nowrap text-left">
            Market
          </th>
          <th className="py-2 px-8 font-light min-w-fit whitespace-nowrap text-right">Leverage</th>
          <th className="py-2 px-8 font-light min-w-fit whitespace-nowrap text-right">
            Funding Rate
          </th>
          <th className="py-2 px-8 font-light min-w-fit whitespace-nowrap text-right">
            Fixed Funding Rate
          </th>
          <th className="py-2 px-8 font-light min-w-fit whitespace-nowrap text-right">YT Price</th>
          <th className="py-2 px-8 font-light min-w-fit whitespace-nowrap text-right">PT Price</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => {
          return (
            <tr key={index} className="group cursor-pointer relative">
              <td className="relative z-1 h-12 w-full px-8 pl-0 py-3">
                <div className="cursor-pointer">
                  <div className="relative flex items-center gap-4">
                    <img src={item.imgUrl} alt="LBTC (Corn)" className="size-9" />
                    <div className="flex flex-col">
                      <span className="relative leading-tight group-hover:font-semibold">
                        <span className="absolute blur inset-0 opacity-0 group-hover:opacity-100">
                          {item.label}
                        </span>
                        {item.label}
                      </span>
                      <span className="text-sm font-light leading-tight">{item.date}</span>
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-8">
                <div className="relative text-xl flex items-center justify-end group-hover:text-green-300">
                  <span className="absolute blur opacity-0 group-hover:opacity-100">
                    {item.leverage}
                  </span>

                  {item.leverage}
                </div>
              </td>
              <td className="px-8">
                <div className="relative text-lg flex items-center justify-end group-hover:text-green-300">
                  <span className="absolute blur opacity-0 group-hover:opacity-100">
                    {item.fundingRate}
                  </span>

                  {item.fundingRate}
                </div>
              </td>
              <td className="px-8">
                <div className="relative text-lg flex items-center justify-end group-hover:text-green-300">
                  <span className="absolute blur opacity-0 group-hover:opacity-100">
                    {item.fixedFundingRate}
                  </span>

                  {item.fixedFundingRate}
                </div>
              </td>

              <td className="px-8">
                <button
                  onClick={() => handleOpenPopup("yt")}
                  className="flex items-center gap-6 justify-between border border-transparent hover:border-main/50 px-4 py-2 rounded-lg cursor-pointer bg-main/10 hover:bg-main/30 transition-all"
                >
                  <p className="font-semibold text-main">YT</p>
                  <div className="flex flex-col justify-end text-end">
                    <p className="text-xs text-white">-5.842%</p>
                    <p className="text-xs text-white/50">$28.14</p>
                  </div>
                </button>
              </td>

              <td className="px-8">
                <button
                  onClick={() => handleOpenPopup("pt")}
                  className="flex items-center gap-6 justify-between border border-transparent hover:border-turqoise/50 px-4 py-2 rounded-lg cursor-pointer bg-turqoise/10 hover:bg-turqoise/30 transition-all"
                >
                  <p className="font-semibold text-turqoise">PT</p>
                  <div className="flex flex-col justify-end text-end">
                    <p className="text-xs text-white">-5.842%</p>
                    <p className="text-xs text-white/50">$28.14</p>
                  </div>
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
