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
                    src="https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png"
                    alt="BTC"
                    className="size-9"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-semibold">BTC</p>
                    <p className="text-xs text-white/50">
                      BTC is Bitcoin, enabling secure and decentralized transactions on the
                      blockchain.
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
      id: "btc",
      label: "BTC",
      imgUrl:
        "https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png",
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
      id: "eth",
      label: "ETH",
      imgUrl:
        "https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png",
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
      id: "sol",
      label: "SOL",
      imgUrl:
        "https://asset-metadata-service-production.s3.amazonaws.com/asset_icons/b658adaf7913c1513c8d120bcb41934a5a4bf09b6adbcb436085e2fbf6eb128c.png",
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
      id: "tia",
      label: "Celestia",
      imgUrl:
        "https://dynamic-assets.coinbase.com/93f5c37c0950575eeaea5adf840629c3eb17b426f170f86f9bbafe025d504fda1f491ff3b839f85461b6f9f14a0a5eeb7f63df5ecd6eb412f0f839a0bae80137/asset_icons/647c4333b5f51fdab5b8769cb6f2d2a554612b94bf1d18c5d7834ee644580f73.png",
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
      id: "bera",
      label: "BERA",
      imgUrl:
        "https://asset-metadata-service-production.s3.amazonaws.com/asset_icons/f267cd737549fb184e0b8a55b3ca9db5f91f90db499260ed06affde20680a38b.png",
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
      id: "doge",
      label: "DOGE",
      imgUrl:
        "https://dynamic-assets.coinbase.com/3803f30367bb3972e192cd3fdd2230cd37e6d468eab12575a859229b20f12ff9c994d2c86ccd7bf9bc258e9bd5e46c5254283182f70caf4bd02cc4f8e3890d82/asset_icons/1597d628dd19b7885433a2ac2d7de6ad196c519aeab4bfe679706aacbf1df78a.png",
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
                    <img src={item.imgUrl} alt="BTC" className="size-9" />
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
