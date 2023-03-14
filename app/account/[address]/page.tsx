import { Suspense } from "react";
import { Balances } from "@/app/account/[address]/balances";
import { Transactions } from "@/app/account/[address]/transactions";
import { gql } from "graphql-request";

import { graphQLClient } from "@/lib/graphql";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function getBalances(address: string) {
    const query = gql`
        query getBalances($address: String!) {
            account(address: $address) {
                balances {
                    nativeBalance
                    nativeBalanceUSD
                    nativeBalanceDecimals
                    tokens {
                        amount
                        amountUSD
                        decimals
                        mint
                    }
                }
            }
        }
    `;

    return graphQLClient.request(query, { address });
}

async function getTransfers(address: string) {
    const query = gql`
        query getTransfers($address: String!) {
            account(address: $address) {
                transactions(type: "TRANSFER") {
                    description
                    timestamp
                    dateUTC
                    nativeTransfers {
                        fromUserAccount
                        toUserAccount
                        amount
                    }
                    tokenTransfers {
                        fromUserAccount
                        toUserAccount
                        tokenAmount
                        mint
                    }
                }
            }
        }
    `;

    return graphQLClient.request(query, { address });
}

type Props = {
    params: {
        address: string;
    };
};

export default async function OverviewPage({ params }: Props) {
    return (
        <section className="grid items-center gap-10">
            <Suspense fallback={"Loading"}>
                {/* @ts-expect-error Async Server Component */}
                <Balances data={getBalances(params.address)} />
            </Suspense>
            <Tabs defaultValue="transactions">
                <TabsList>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="swaps">Swaps</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions">
                    <Suspense fallback={"Loading"}>
                        {/* @ts-expect-error Async Server Component */}
                        <Transactions data={getTransfers(params.address)} />
                    </Suspense>
                </TabsContent>
                <TabsContent value="swaps">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Soon
                    </p>
                </TabsContent>
            </Tabs>
        </section>
    );
}

export const metadata = {
    title: "Account Overview",
};
