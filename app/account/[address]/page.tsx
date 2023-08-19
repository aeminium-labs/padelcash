import { Suspense } from "react";
import { Transactions } from "@/app/account/[address]/transactions";
import { AuthChecker } from "@/app/auth-checker";
import { gql } from "graphql-request";

import { getPadelAta } from "@/lib/fetchers";
import { graphQLClient } from "@/lib/graphql";
import { PadelBalance } from "@/components/padelBalance";
import { Container } from "@/components/shared/container";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

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
    const account = await getPadelAta(address);

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

    if (account.ata) {
        return graphQLClient.request<Transactions>(query, {
            address: account.ata,
        });
    }

    return Promise.resolve({ account: { transactions: [] } });
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
                <Suspense fallback={<Skeleton className="h-80 w-full" />}>
                    <ScrollArea className="flex h-96 grow rounded-xl border">
                        <Transactions
                            data={getTransfers(params.address)}
                            accountAddress={params.address}
                        />
                    </ScrollArea>
                </Suspense>
            </Container>
        </AuthChecker>
    );
}

export const metadata = {
    title: "Accounts",
};

export const revalidate = 0;
