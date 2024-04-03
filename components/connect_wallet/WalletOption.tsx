"use client"
import { useConnect } from "wagmi"
import { Connector } from "wagmi"
import * as React from "react"
interface WalletOptionProps {
    connector: Connector
    onClick: () => void
}
export default function WalletOption({ connector, onClick }: WalletOptionProps) {
    const [ready, setReady] = React.useState(false)
    React.useEffect(() => {
        ;(async () => {
            if (!connector.getProvider) {
                return
            }
            const provider = await connector.getProvider()
            setReady(!!provider)
        })()
    }, [connector])

    return (
        <button onClick={onClick} disabled={!ready}>
            {connector.name}
        </button>
    )
}
