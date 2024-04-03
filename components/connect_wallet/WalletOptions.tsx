"use client"
import { Connector, useConnect } from "wagmi"
import WalletOption from "./WalletOption"
import * as React from "react"

export default function WalletOptions() {
    const { connectors, connect } = useConnect()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    return mounted ? (
        connectors.map((connector) => (
            <WalletOption
                key={connector.id}
                connector={connector}
                onClick={() => {
                    connect({ connector })
                }}
            />
        ))
    ) : (
        <div />
    )

    //   return [
    //     <WalletOption
    //       key={connectors[1].id}
    //       connector={connectors[1]}
    //       onClick={() => {
    //         console.log("click wallet", connectors[1].name);
    //         const connector = connectors[1];
    //         connect({ connector });
    //       }}
    //     />,
    //     <WalletOption
    //       key={connectors[2].id}
    //       connector={connectors[2]}
    //       onClick={() => {
    //         console.log("click wallet", connectors[2].name);
    //         const connector = connectors[2];
    //         connect({ connector });
    //       }}
    //     />,
    //   ];
}
