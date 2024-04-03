"use client"
import { useAccount } from "wagmi"
import WalletOptions from "./WalletOptions"
import Account from "./Account"

export default function WagmiBaseConnectButton() {
    const { isConnected } = useAccount()
    if (isConnected) {
        return <Account />
    }

    return <WalletOptions />
}
