import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi"

export default function Account() {
    const { address } = useAccount()
    const { disconnect } = useDisconnect()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName?.toString() })

    return (
        <div>
            {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
            {address && <div>{ensName ? "${ensName} (${address})" : address}</div>}
            {
                <button
                    onClick={() => {
                        console.log("disconnect")
                        disconnect()
                    }}
                >
                    Disconnect
                </button>
            }
        </div>
    )
}