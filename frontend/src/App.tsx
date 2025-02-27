import { Route, Routes } from "react-router-dom"
import Layout from "@/Layout"
import { Home } from "@/pages/Home"
import { Deposit } from "./pages/Deposit"
// import { Tokenize } from "./pages/Tokenize"
import { Mint } from "./pages/Mint"
import { Swap } from "./pages/Swap"
import Faucet from "./pages/Faucet"
import { Toaster } from "sonner"

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
        </Routes>
      </Layout>
      <Toaster />
    </>
  )
}

export default App
