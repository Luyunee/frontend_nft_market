import { http, createConfig } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { injected, metaMask, walletConnect } from "wagmi/connectors"

export const wagmiConfig = createConfig({
    chains: [sepolia],
    pollingInterval: 1_000,
    connectors: [metaMask],
    transports: {
        [sepolia.id]: http(),
    },
})
