import { tokenaryWallet } from "@rainbow-me/rainbowkit/wallets"
import { useEffect } from "react"

interface NFTBoxProps {
    imageURIURL: string
    tokenName: string
    tokenDescription: string
}
export default function useNftInfoEffect(func: (props: NFTBoxProps) => void, tokenURI?: unknown) {
    useEffect(() => {
        const f = async () => {
            console.log(`TokenURI is: ${tokenURI?.toString()}`)
            // We are cheating a bit here...
            if (tokenURI) {
                const requestURL =
                    tokenURI?.toString().replace("ipfs://", "https://ipfs.io/ipfs/") ?? ""
                const tokenURIResponse = await (await fetch(requestURL)).json()
                const imageURI = tokenURIResponse.image
                const imageURIURL = (imageURI as string).replace("ipfs://", "https://ipfs.io/ipfs/")

                func({
                    imageURIURL: imageURIURL,
                    tokenName: tokenURIResponse.name,
                    tokenDescription: tokenURIResponse.description,
                })
            }
        }
        f()
    }, [tokenURI])
}
