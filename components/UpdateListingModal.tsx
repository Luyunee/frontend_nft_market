import { Modal, useNotification, Input, Illustration, Button } from "@web3uikit/core"
import { useState } from "react"
import nftAbiConstant from "../constants/BasicNft.json"
import nftMarketplaceAbiConstant from "../constants/NftMarketplace.json"
import { ethers } from "ethers"
import Image from "next/image"
import {
    useBlock,
    useTransactionConfirmations,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi"
import { useQueryNFTsContext } from "@/app/QueryNFTsContext"

export interface UpdateListingModalProps {
    isVisible: boolean
    onClose: () => void
    nftMarketplaceAbi: object
    nftMarketplaceAddress: string
    nftAddress: string
    tokenId: string
    imageURI: string | undefined
    currentPrice: number | undefined
}

export const UpdateListingModal = ({
    isVisible,
    onClose,
    nftMarketplaceAbi,
    nftMarketplaceAddress,
    nftAddress,
    tokenId,
    imageURI,
    currentPrice,
}: UpdateListingModalProps) => {
    const dispatch = useNotification()

    const { refetch: reQueryNfts } = useQueryNFTsContext()

    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState<string | undefined>()

    const handleUpdateListingSuccess = () => {
        dispatch({
            type: "success",
            message: "Listing updated successfully",
            title: "Listing Updated",
            position: "topR",
        })
        onClose && onClose()
    }

    const handleCancelListingSuccess = () => {
        dispatch({
            type: "success",
            message: "Listing canceled successfully",
            title: "Listing Canceled",
            position: "topR",
        })
        onClose && onClose()
    }
    const { data: updateListingTxHash, writeContractAsync: updateListingAsync } = useWriteContract()
    const { writeContractAsync: cancelListingAsync } = useWriteContract()

    const {
        isLoadingError: isUpdateListingLoadingError,
        isError: isUpateListingError,
        isLoading: isUpdateListingConfirming,
        isSuccess: isUpdateListingConfirmed,
    } = useWaitForTransactionReceipt({
        hash: updateListingTxHash,
        confirmations: 0,
    })
    console.log(` updateListingTxHash: ${updateListingTxHash}`)
    console.log(`isUpdateListingLoadingError: ${isUpdateListingLoadingError}`)
    console.log(`isUpdateListingError: ${isUpateListingError}`)
    console.log(`isUpdateListingConfirming: ${isUpdateListingConfirming}`)
    console.log(`isUpdateListingConfirmed: ${isUpdateListingConfirmed}`)
    const { data: confirmations, refetch: refetchConfirmations } = useTransactionConfirmations({
        hash: updateListingTxHash,
    })
    console.log(`confirmations: ${confirmations}`)
    if (isUpdateListingConfirmed) {
        refetchConfirmations()
        console.log(`inside confirmations: ${confirmations}`)
        reQueryNfts()
    }

    async function updateListingWrap() {
        console.log(`priceToUpdate: ${ethers.utils.parseEther(priceToUpdateListingWith || "0")}`)
        console.log(`tokenId1: ${tokenId}`)
        const result = await updateListingAsync(
            {
                abi: (nftMarketplaceAbi as typeof nftMarketplaceAbiConstant).abi,
                address: nftMarketplaceAddress as `0x${string}`,
                functionName: "updateListing",
                args: [
                    nftAddress,
                    tokenId,
                    ethers.utils.parseEther(priceToUpdateListingWith || "0"),
                ],
            },
            {
                onSuccess: () => {
                    console.log("handleUpdateListingSuccess onSuccess")
                    handleUpdateListingSuccess()
                },
                onError: (error) => {
                    console.log(`updateListingAsync Error: ${error}`)
                },
            }
        )
    }

    async function cancelListingWrap() {
        await cancelListingAsync(
            {
                abi: (nftMarketplaceAbi as typeof nftMarketplaceAbiConstant).abi,
                address: nftAddress as `0x${string}`,
                functionName: "cancelListing",
                args: [nftAddress, tokenId],
            },
            {
                onSuccess: () => handleCancelListingSuccess(),
            }
        )
    }

    return (
        <Modal
            isVisible={isVisible}
            id="regular"
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => updateListingWrap()}
            title="NFT Details"
            okText="Save New Listing Price"
            cancelText="Leave it"
            isOkDisabled={!priceToUpdateListingWith}
        >
            <div
                style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <div className="flex flex-col items-center gap-4">
                    <p className="p-4 text-lg">
                        This is your listing. You may either update the listing price or cancel it.
                    </p>
                    <div className="flex flex-col items-end gap-2 border-solid border-2 border-gray-400 rounded p-2 w-fit">
                        <div>#{tokenId}</div>
                        {imageURI ? (
                            <Image
                                loader={() => imageURI}
                                src={imageURI}
                                alt=""
                                height="200"
                                width="200"
                            />
                        ) : (
                            <Illustration height="180px" logo="lazyNft" width="100%" />
                        )}
                        <div className="font-bold">
                            {ethers.utils.formatEther(currentPrice || 0)} ETH
                        </div>
                    </div>
                    <Input
                        label="Update listing price"
                        name="New listing price"
                        onChange={(event) => {
                            setPriceToUpdateListingWith(event.target.value)
                        }}
                        type="number"
                    />
                    or
                    <Button
                        id="cancel-listing"
                        onClick={() =>
                            // cancelListing({
                            //     onSuccess: () => handleCancelListingSuccess(),
                            // })
                            cancelListingWrap()
                        }
                        text="Cancel Listing"
                        theme="colored"
                        color="red"
                        type="button"
                    />
                </div>
            </div>
        </Modal>
    )
}
