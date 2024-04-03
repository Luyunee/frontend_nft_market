"use client"

import React from "react"
import { RainbowKitProvider, getDefaultWallets, connectorsForWallets } from "@rainbow-me/rainbowkit"
import { argentWallet, trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { wagmiConfig } from "../../constants/wagmiConfig.js"
import { WagmiProvider } from "wagmi"
import { NotificationProvider } from "@web3uikit/core"
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

// const { wallets } = getDefaultWallets({
//     appName: "RainbowKit demo",
//     projectId,
//     chains,
// })

const demoAppInfo = {
    appName: "Rainbowkit Demo",
}

// const connectors = connectorsForWallets([
//     ...wallets,
//     {
//         groupName: "Other",
//         wallets: [
//             argentWallet({ projectId, chains }),
//             trustWallet({ projectId, chains }),
//             ledgerWallet({ projectId, chains }),
//         ],
//     },
// ])

// const wagmiConfig = createConfig({
//     chains: [sepolia],
//     autoConnect: true,
//     connectors,
//     publicClient,
//     webSocketPublicClient,
// })
// deployment id: QmaNnndProrwZUJfccbLLHNk6d7nhipkn4u7ZQ66jQkopL⁠

const queryClient = new QueryClient()

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/66885/lu-nft-marketplace/0.0.6",
})
const Providers = ({ children }) => {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider appInfo={demoAppInfo} modalSize="compact">
                    <NotificationProvider>
                        <ApolloProvider client={client}>{children}</ApolloProvider>
                    </NotificationProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default Providers
