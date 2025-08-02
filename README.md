# $UNREAL Cross-Chain Swap

A cross-chain token swap application for $UNREAL between Etherlink (EVM) and NEAR chains using TypeScript, Next.js, Viem, and TailwindCSS.

This project was built for a hackathon to demonstrate cross-chain token transfers using Hashed TimeLock Contracts (HTLC).

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Features

- Cross-chain token swaps between Etherlink (EVM) and NEAR chains
- Hashed TimeLock Contract (HTLC) integration
- Modern, responsive Uniswap-inspired UI
- Wallet connections for both EVM and NEAR
- Real-time balance and transaction status updates

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- NEAR CLI installed globally (`npm install -g near-cli`)
- Etherlink wallet (MetaMask with Etherlink network added)
- NEAR wallet (MyNearWallet or NEAR wallet)

### Installation

```bash
# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Navigate to [http://localhost:3000/swap](http://localhost:3000/swap) to access the swap interface.

## Using the Swap Interface

1. Connect both your NEAR and Etherlink wallets using the connect buttons
2. Select the source and target chains
3. Enter the amount of $UNREAL tokens to swap
4. Click the "Swap" button to initiate the cross-chain transfer
5. For Etherlink → NEAR: 
   - Approve tokens (if needed)
   - Lock tokens in the HTLC
   - Complete the swap by revealing the secret on the target chain
6. For NEAR → Etherlink:
   - Lock tokens in the NEAR HTLC
   - Complete the swap by revealing the secret on the target chain

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Technical Implementation

### Contracts

The application integrates with two main contracts:

- **Etherlink HTLC**: Handles EVM-side token locking, withdrawals, and refunds
- **NEAR HTLC**: Handles NEAR-side token locking, withdrawals, and refunds

Contract addresses are loaded from `deployment-info.json`.

### Frontend

- **TypeScript/Next.js**: Strongly typed React framework
- **TailwindCSS**: Utility-first CSS framework for styling
- **Viem**: Modern Ethereum library for EVM interactions
- **NEAR Wallet Selector**: For NEAR wallet integration

## Learn More about NEAR

To learn more about NEAR, take a look at the following resources:

- [NEAR Documentation](https://docs.near.org) - learn about NEAR Protocol
- [NEAR Wallet Selector](https://github.com/near/wallet-selector) - wallet integration tool

You can check out [the NEAR repository](https://github.com/near) - your feedback and contributions are welcome!

## Future Enhancements

- Integration with 1inch Fusion API for better price discovery
- Support for additional chains (e.g., Aptos)
- Improved transaction status tracking
- User history and analytics
- Auto-completion of cross-chain swaps

## Learn More about the Tech Stack

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Viem Documentation](https://viem.sh/docs/getting-started.html) - modern TypeScript Ethereum library
- [TailwindCSS Documentation](https://tailwindcss.com/docs) - utility-first CSS framework

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployment

This application can be deployed on Vercel or any platform that supports Next.js applications.

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Hackathon Notes

This project was built for a hackathon demonstration of cross-chain interoperability between Etherlink and NEAR. The implementation uses a simplified version of HTLC mechanics for demonstration purposes. In a production environment, additional security measures would be implemented.

## License

MIT
