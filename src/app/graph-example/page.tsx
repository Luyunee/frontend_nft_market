"use client"
import { useQuery, gql } from "@apollo/client"

const GET_ACTIVE_ITEM = gql`
    {
        activeItems(first: 5) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`
export default function GraphExample() {
    const { loading, error, data } = useQuery(GET_ACTIVE_ITEM)
    console.log(data)
    return <div>hi graph example</div>
}
