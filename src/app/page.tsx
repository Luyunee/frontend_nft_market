"use client"

import { useChainId, useEstimateGas } from "wagmi"
import GET_ACTIVE_ITEMS from "../../constants/subgraphQueries"
import networkConfig from "../../constants/networkMapping.json"
import { ApolloQueryResult, OperationVariables, useQuery } from "@apollo/client"
import { list } from "postcss"
import React, { useState } from "react"
import NFTBox from "../../components/NFTBox"
import { QueryNFTsProvider, useQueryNFTs } from "./QueryNFTsContext"
import NFTList from "../../components/NFTList"

export interface NftInterface {
    price: number
    nftAddress: string
    tokenId: string
    address: string
    seller: string
}

interface contractAddressesInterface {
    [key: string]: contractAddressesItemInterface
}

interface contractAddressesItemInterface {
    [key: string]: string[]
}

const RefetchNFTsContext = React.createContext<
    ((variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>) | undefined
>(undefined)

export default function Home() {
    const chainId = useChainId()
    useState
    // const chainId = 11155111
    const addresses: contractAddressesInterface = networkConfig

    const marketplaceAddress =
        typeof addresses[chainId] != "undefined"
            ? addresses[chainId]["NftMarketplace"][0]
            : "11155111"

    // const {
    //     refetch: refetchActiveItems,
    //     loading,
    //     error: subgraphQueryError,
    //     data: listedNfts,
    // } = useQuery(GET_ACTIVE_ITEMS)
    // const a = useQuery(GET_ACTIVE_ITEMS)

    return (
        // <RefetchNFTsContext.Provider value={refetchActiveItems}>
        <QueryNFTsProvider>
            <div className="container mx-auto">
                <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
                <div className="flex flex-wrap">
                    <NFTList marketplaceAddress={marketplaceAddress} />
                    {/* {loading || !listedNfts ? (
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
                    )} */}
                </div>
            </div>
        </QueryNFTsProvider>
        // </RefetchNFTsContext.Provider>
    )
}
