# 📜 Novaria Smart Contracts

## 📌 Introduction
Novaria's smart contracts serve as the backbone of the protocol, enabling yield tokenization and seamless on-chain interactions. Built using Foundry, these contracts facilitate efficient, decentralized, and secure yield management.

![Novaria Assets](frontend/src/assets/workflow.jpg)

## 🏗 Project Structure
The smart contract repository consists of the following key components:
- **📂 `contracts/`** - Contains all core smart contracts.
- **📂 `scripts/`** - Deployment and automation scripts.
- **📂 `test/`** - Unit tests for contract verification.
- **📄 `foundry.toml`** - Foundry configuration file.

## 🔄 Application Workflow
1. **User Deposits Collateral**: 
   - The user locks an asset (e.g., WBTC) into the Novaria vault.
   - A corresponding amount of vault tokens is minted to the user’s wallet.
2. **Yield Tokenization Process**: 
   - The funding rate yield is separated from the principal asset.
   - Two tokens are generated: Yield Token (YT) and Principal Token (PT).
3. **Trading & Liquidity Management**:
   - Users can sell YT to lock in future yield earnings.
   - PT can be held or traded on decentralized exchanges.
4. **Redemption & Settlement**:
   - When the position is closed, PT can be redeemed for the original collateral.
   - Yield is distributed accordingly to YT holders.

## ⚙️ Setup and Installation
### 📌 Prerequisites
- Install [Foundry](https://github.com/foundry-rs/foundry) by running:
  ```sh
  curl -L https://foundry.paradigm.xyz | bash
  foundryup
  ```
- Node.js (latest LTS version)
- An Ethereum-compatible wallet (e.g., MetaMask)

### 📥 Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/novaria-defi/novaria.git
   cd novaria
   ```
2. Install dependencies:
   ```sh
   forge install
   ```

## 🚀 Compilation and Testing
### 🔧 Compile the Smart Contracts
Run the following command to compile the contracts:
```sh
forge build
```

### ✅ Run Tests
Execute tests to ensure contract correctness:
```sh
forge test
```

## 🚀 Deployment
To deploy contracts on a testnet or mainnet, execute:
```sh
forge script scripts/deploy.s.sol --rpc-url <NETWORK_RPC_URL> --private-key <YOUR_PRIVATE_KEY>
```
Replace `<NETWORK_RPC_URL>` and `<YOUR_PRIVATE_KEY>` with the appropriate values.

## 🛠 Special Instructions
- Ensure your wallet has sufficient test ETH for deployment on a testnet.
- Update environment variables as needed for different networks.
- Regularly run tests after making modifications to the contracts.

## 🎯 Conclusion
The Novaria smart contracts empower yield tokenization with security and efficiency. Developers and contributors are encouraged to explore, test, and contribute to the codebase.

For further inquiries, refer to the official Novaria repository: [Novaria GitHub](https://github.com/novaria-defi/novaria).

