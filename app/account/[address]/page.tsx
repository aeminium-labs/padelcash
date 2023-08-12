import { cache, Suspense } from "react";
import { Balances } from "@/app/account/[address]/balances";
import { Transactions } from "@/app/account/[address]/transactions";
import { AuthChecker } from "@/app/auth-checker";
import { gql } from "graphql-request";

import { graphQLClient } from "@/lib/graphql";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getBalances = cache(async (address: string) => {
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

    return graphQLClient.request<Balances>(query, { address });
});

const getTransfers = cache(async (address: string) => {
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

    return graphQLClient.request<Transactions>(query, { address });
});

type Props = {
    params: {
        address: string;
    };
};

export default function OverviewPage({ params }: Props) {
    return (
        <AuthChecker>
            <section className="container grid items-center gap-6 pt-6 px-4">
                <Suspense fallback={"Loading"}>
                    <Balances data={getBalances(params.address)} />
                </Suspense>
                <Tabs defaultValue="transactions">
                    <TabsList>
                        <TabsTrigger value="transactions">
                            Transactions
                        </TabsTrigger>
                        <TabsTrigger value="swaps">Swaps</TabsTrigger>
                    </TabsList>
                    <TabsContent value="transactions">
                        <Suspense fallback={"Loading"}>
                            <Transactions
                                data={getTransfers(params.address)}
                                accountAddress={params.address}
                            />
                        </Suspense>
                    </TabsContent>
                    <TabsContent value="swaps">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Soon
                        </p>
                    </TabsContent>
                </Tabs>
            </section>
        </AuthChecker>
    );
}

export const metadata = {
    title: "Accounts",
};

export const revalidate = 30;
