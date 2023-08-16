import { Suspense } from "react";
import { Transactions } from "@/app/account/[address]/transactions";
import { AuthChecker } from "@/app/auth-checker";
import { gql } from "graphql-request";

import { PADEL_TOKEN } from "@/lib/constants";
import { graphQLClient } from "@/lib/graphql";
import { getBaseUrl } from "@/lib/utils";
import { PadelBalance } from "@/components/padelBalance";
import { Container } from "@/components/shared/container";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type AccountBalances = {
    account: {
        balances: {
            nativeBalance: number;
            nativeBalanceUSD: number;
            nativeBalanceDecimals: number;
            tokens: [
                {
                    amount: number;
                    amountUSD: number;
                    decimals: number;
                    mint: string;
                },
            ];
        };
    };
};

const getBalances = async (address: string) => {
    const query = gql`
        query getBalances($address: String!) {
            account(address: $address) {
                balances {
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

    return graphQLClient.request<AccountBalances>(query, { address });
};

const getTransfers = async (address: string) => {
    const baseUrl = getBaseUrl();
    const ataReq = await fetch(
        `${baseUrl}/api/${address}/getAta?mint=${PADEL_TOKEN}`
    );
    const ataAddress = await ataReq.json();

    const query = gql`
        query getTransfers($address: String!) {
            account(address: $address) {
                transactions(type: "TRANSFER") {
                    signature
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

    return graphQLClient.request<Transactions>(query, {
        address: ataAddress.ata,
    });
};

type Props = {
    params: {
        address: string;
    };
};

export default function OverviewPage({ params }: Props) {
    return (
        <AuthChecker address={params.address}>
            <Container>
                <Suspense fallback={<Skeleton className="h-36 w-full" />}>
                    <PadelBalance data={getBalances(params.address)} />
                </Suspense>
                <Tabs defaultValue="activity">
                    <TabsList>
                        <TabsTrigger value="activity">
                            Recent Activity
                        </TabsTrigger>
                        <TabsTrigger value="requests" disabled>
                            Requests
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="activity">
                        <Suspense
                            fallback={<Skeleton className="h-80 w-full" />}
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
            </Container>
        </AuthChecker>
    );
}

export const metadata = {
    title: "Accounts",
};

export const revalidate = 30;
