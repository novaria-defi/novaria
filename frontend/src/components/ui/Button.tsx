import React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = (props: ButtonProps) => {
  const { children, className, ...rest } = props
  return (
    <button
      {...rest}
      type="button"
      className="rounded-lg bg-teal-400 text-teal-950  px-5 py-1.5 text-center relative overflow-hidden transition-colors duration-300 cursor-pointer group-hover:text-zinc-700 group-hover:font-semibold">
      {children}
    </button>
  )
}

export default Button
