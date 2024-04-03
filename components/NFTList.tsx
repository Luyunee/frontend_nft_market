"use client"
import { useQueryNFTsContext } from "@/app/QueryNFTsContext"
import NFTBox from "./NFTBox"
import { NftInterface } from "@/app/page"

interface NFTListProps {
    marketplaceAddress: string
}
export default function NFTList({ marketplaceAddress }: NFTListProps) {
    const { loading, data: listedNfts, refetch } = useQueryNFTsContext()

    return (
        <div>
            <button
                onClick={() => {
                    refetch()
                    console.log("refetch onclick")
                }}
            >
                refetch
            </button>
            {loading || !listedNfts ? (
                <div>Loading...</div>
            ) : (
                listedNfts.activeItems.map((nft: NftInterface) => {
                    const { price, nftAddress, tokenId, seller } = nft

                    return (
                        <NFTBox
                            price={price}
                            nftAddress={nftAddress}
                            tokenId={tokenId}
                            nftMarketplaceAddress={marketplaceAddress!}
                            seller={seller}
                            key={`${nftAddress}${tokenId}`}
                        />
                    )
                })
            )}
        </div>
    )
}
