import React, { useContext, useState } from "react"
import { ApolloQueryResult, OperationVariables, QueryResult, useQuery } from "@apollo/client"
import GET_ACTIVE_ITEMS from "../../constants/subgraphQueries"

const QueryNFTsContext = React.createContext<QueryResult<any, OperationVariables> | undefined>(
    undefined
)
export function useQueryNFTsContext() {
    const value = useContext(QueryNFTsContext)
    // Check the value is not undefined and
    // has been initialised by the provider
    if (value == null) {
        throw new Error(
            'The "useContext" hook must be used within the corresponding context "Provider"'
        )
    }
    return value
}

export function QueryNFTsProvider({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const result = useQuery(GET_ACTIVE_ITEMS)

    return <QueryNFTsContext.Provider value={result}>{children}</QueryNFTsContext.Provider>
}
