import { NavLink } from "react-router-dom"
import clsx from "clsx"
import { ConnectWalletButton } from "../ConnectWalletButton"

const navbarItems = [
  { label: "Home", path: "/" },
  { label: "Mint", path: "/mint" },
  { label: "Deposit", path: "/deposit" },
  { label: "Faucet", path: "/faucet" },
]

export const Navbar = () => {
  return (
    <nav className="fixed z-20 w-full mt-4">
      <div className="relative flex items-center px-8 py-4 justify-between w-full max-w-[1440px] mx-auto bg-black/10 rounded-full border border-main/10 shadow">
        <div className="flex items-center gap-2">
          {/* <img src={NovariaLogo} className="size-7" /> */}
          <h1 className="text-white text-xl tracking-wider">🐳 Novaria</h1>
        </div>

        {/* Centered UL List */}
        <ul className="absolute left-1/2 transform -translate-x-1/2 lg:flex hidden space-x-8 text-lg">
          {navbarItems.map(item => (
            <li className="relative group" key={item.label}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  clsx(
                    "relative group-hover:text-teal-200",
                    isActive
                      ? "bg-gradient-to-tr from-teal-100 to-teal-200 font-semibold text-transparent bg-clip-text"
                      : "text-teal-400"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={clsx(
                        "absolute -inset-0 text-teal-100 blur",
                        isActive ? "block" : "hidden",
                        "group-hover:block"
                      )}
                    >
                      {item.label}
                    </span>

                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div>
          <ConnectWalletButton />
        </div>
      </div>
    </nav>
  )
}
