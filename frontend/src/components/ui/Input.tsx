import { forwardRef } from "react"
import WBTCIcon from "@/assets/wbtc_logo.svg"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, icon, ...restProps } = props
  return (
    <div
      className={`flex w-full gap-2 border border-white/50 p-2 rounded-xl focus-within:ring focus-within:ring-main/50 focus-within:ring-offset-0 ${className}`}
    >
      {icon}
      <input
        {...restProps}
        ref={ref}
        className="outline-none w-full text-end text-xl px-3 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        placeholder="0.00"
      />
    </div>
  )
})

export const NovariaTokenLogo = ({ type }: { type?: "PT" | "YT" }) => {
  return (
    <div className="text-md font-semibold flex rounded-full py-1.5 px-3 items-center gap-3 hover:bg-zinc-600 cursor-pointer">
      <span className="p-2 ring-3 bg-white rounded-full text-black ring-blue-600 text-lg font-bold italic w-6 h-6 flex items-center justify-center ring-offset-2 ring-offset-black">
        N
      </span>
      <div>
        <p className="text-nowrap">NOVA</p>
        {type && <p className="text-[10px] text-white/50">{type}</p>}
      </div>
    </div>
  )
}

export const WBTCTokenLogo = () => {
  return (
    <div className="text-md font-semibold flex rounded-full py-1.5 px-4 items-center gap-3 hover:bg-zinc-600 cursor-pointer">
      <span className="bg-white rounded-full text-xs w-7 h-7 flex items-center justify-center">
        <img src={WBTCIcon} />
      </span>

      <span className="text-white"> WBTC</span>
    </div>
  )
}
