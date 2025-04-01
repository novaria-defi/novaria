import { Route, Routes } from "react-router-dom"
import Layout from "@/Layout"
import { Home } from "@/pages/Home"
import { Deposit } from "./pages/Deposit"
// import { Tokenize } from "./pages/Tokenize"
import { Mint } from "./pages/Mint"
import { Swap } from "./pages/Swap"
import { Toaster } from "sonner"
import { Bridge } from "./pages/Bridge"
import Faucet from "./pages/Faucet"

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/faucet" element={<Faucet />} />
          <Route path="/bridge" element={<Bridge />} />
        </Routes>
      </Layout>
      <Toaster />
    </>
  )
}

export default App
