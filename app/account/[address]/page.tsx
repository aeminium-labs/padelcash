import { Suspense } from "react";
import { Balances } from "@/app/account/[address]/balances";
import { Transactions } from "@/app/account/[address]/transactions";
import { AuthChecker } from "@/app/auth-checker";
import { gql } from "graphql-request";

import { graphQLClient } from "@/lib/graphql";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getBalances = async (address: string) => {
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
};

const getTransfers = async (address: string) => {
    const query = gql`
        query getTransfers($address: String!) {
            account(address: $address) {
                transactions(type: "TRANSFER") {
                    timestamp
                    dateUTC
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
};

type Props = {
    params: {
        address: string;
    };
};

export default function OverviewPage({ params }: Props) {
    return (
        <AuthChecker address={params.address}>
            <section className="container grid items-center gap-6 pt-6 px-4">
                <Suspense fallback={<Skeleton className="h-24 w-full" />}>
                    <Balances data={getBalances(params.address)} />
                </Suspense>
                <Tabs defaultValue="activity">
                    <TabsList>
                        <TabsTrigger value="activity">
                            Recent Activity
                        </TabsTrigger>
                        <TabsTrigger value="requests">Requests</TabsTrigger>
                    </TabsList>
                    <TabsContent value="activity">
                        <Suspense
                            fallback={<Skeleton className="h-8 w-full" />}
                        >
                            <ScrollArea className="h-80 border rounded-xl ">
                                <Transactions
                                    data={getTransfers(params.address)}
                                    accountAddress={params.address}
                                />
                            </ScrollArea>
                        </Suspense>
                    </TabsContent>
                    <TabsContent value="requests">
                        <div className="flex flex-col pt-2 px-2 gap-2">
                            Soon
                        </div>
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
