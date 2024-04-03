"use client"
import type { NextPage } from "next"
import { Card, Tooltip, Illustration, Modal, useNotification, Input, Button } from "@web3uikit/core"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"

// import { useMoralis, useWeb3Contract } from "react-moralis"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { SellNFTModal } from "./SelllNFTModal"
import { UpdateListingModal } from "./UpdateListingModal"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useReadContract, useWriteContract, useAccount, useChainId } from "wagmi"
import useNftInfoEffect from "./hooks/useNftInfoEffect"
import { useQueryNFTsContext } from "@/app/QueryNFTsContext"

interface NFTBoxProps {
    price?: number
    nftAddress: string
    tokenId: string
    nftMarketplaceAddress: string
    seller?: string
}

const truncateStr = (fullStr: string, strLen: number) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."

    var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2)

    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars)
}

const NFTBox: NextPage<NFTBoxProps> = ({
    price,
    nftAddress,
    tokenId,
    nftMarketplaceAddress,
    seller,
}: NFTBoxProps) => {
    const chainId = useChainId()
    // connectors[1].conn
    const account = useAccount()
    // const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState<string | undefined>()
    const [tokenName, setTokenName] = useState<string | undefined>()
    const [tokenDescription, setTokenDescription] = useState<string | undefined>()
    // State to handle display of 'create listing' or 'update listing' modal
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const isListed = seller !== undefined
    const { refetch: reQueryNfts } = useQueryNFTsContext()

    const dispatch = useNotification()

    const { isLoading: tokenURIIsLoading, data: tokenURI } = useReadContract({
        abi: nftAbi.abi,
        address: nftAddress as `0x${string}`,
        functionName: "tokenURI",
        args: [tokenId],
    })

    const { writeContractAsync: buyItem } = useWriteContract()

    useNftInfoEffect(
        ({ imageURIURL, tokenName, tokenDescription }) => {
            setImageURI(imageURIURL)
            setTokenName(tokenName)
            setTokenDescription(tokenDescription)
        },
        [tokenURI]
    )
    const isOwnedByUser =
        seller?.toLowerCase() == account.address?.toLowerCase() || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)

    const { openConnectModal } = useConnectModal()

    const handleCardClick = async function () {
        if ((account.isDisconnected || !account.isConnected) && openConnectModal) {
            openConnectModal()
            return
        }
        if (isOwnedByUser) {
            setShowModal(true)
        } else {
            console.log(`nftmarketplace address: ${nftMarketplaceAddress}`)
            await buyItem(
                {
                    abi: nftMarketplaceAbi.abi,
                    address: nftMarketplaceAddress as `0x${string}`,
                    // address: "0x3b0f0a27a239125e7718675bc4Efd56bb8eDE248",
                    functionName: "buyItem",
                    value: BigInt(price ?? 0),
                    args: [nftAddress, tokenId],
                },
                {
                    onSuccess: () => {
                        handleBuyItemSuccess()
                    },
                    onError: (error) => console.log(`buyItem , cause: ${error.stack}`),
                }
            )
        }
    }

    const handleBuyItemSuccess = () => {
        dispatch({
            type: "success",
            message: "Item bought successfully",
            title: "Item Bought",
            position: "topR",
        })
        reQueryNfts()
    }

    const tooltipContent = isListed
        ? isOwnedByUser
            ? "Update listing"
            : "Buy me"
        : "Create listing"

    return (
        <div className="p-2">
            <SellNFTModal
                isVisible={showModal && !isListed}
                imageURI={imageURI}
                nftAbi={nftAbi}
                nftMarketplaceAbi={nftMarketplaceAbi}
                nftAddress={nftAddress}
                tokenId={tokenId}
                onClose={hideModal}
                nftMarketplaceAddress={nftMarketplaceAddress}
            />
            <UpdateListingModal
                isVisible={showModal && isListed}
                imageURI={imageURI}
                nftMarketplaceAbi={nftMarketplaceAbi}
                nftAddress={nftAddress}
                tokenId={tokenId}
                onClose={hideModal}
                nftMarketplaceAddress={nftMarketplaceAddress}
                currentPrice={price}
            />
            <Card title={tokenName} description={tokenDescription} onClick={handleCardClick}>
                <Tooltip content={tooltipContent} position="top">
                    <div className="p-2">
                        {imageURI ? (
                            <div className="flex flex-col items-end gap-2">
                                <div>#{tokenId}</div>
                                <div className="italic text-sm">
                                    Owned by {formattedSellerAddress}
                                </div>
                                <Image
                                    loader={() => imageURI}
                                    src={imageURI}
                                    alt=""
                                    height="200"
                                    width="200"
                                />
                                {price && (
                                    <div className="font-bold">
                                        {ethers.utils.formatEther(price)} ETH
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <Illustration height="180px" logo="lazyNft" width="100%" />
                                Loading...
                            </div>
                        )}
                    </div>
                </Tooltip>
            </Card>
        </div>
    )
}
export default NFTBox
