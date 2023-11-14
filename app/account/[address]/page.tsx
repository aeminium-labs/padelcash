import { Suspense } from "react";
import { Transactions } from "@/app/account/[address]/transactions";
import { AuthChecker } from "@/app/auth-checker";
import { gql } from "graphql-request";

import { graphQLClient } from "@/lib/graphql";
import { getPadelAta } from "@/lib/server/fetchers";
import { Icons } from "@/components/icons";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
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

const getTransactions = async (address: string) => {
    const account = await getPadelAta(address);

    const query = gql`
        query getTransfers($address: String!) {
            account(address: $address) {
                transactions(type: "TRANSFER", commitment: "confirmed") {
                    signature
                    timestamp
                    dateUTC
                    tokenTransfers {
                        fromUserAccount
                        toUserAccount
                        tokenAmount
                        tokenAmountUSD
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
            <Container className="pb-24">
                <div className="fixed inset-x-2 bottom-16 z-10 flex flex-row gap-2">
                    <Button
                        variant="secondary"
                        size="default"
                        className="grow flex-row items-center gap-2 md:flex"
                    >
                        <Icons.receive className="h-4 w-4" />
                        Receive
                    </Button>
                    <Button
                        variant="secondary"
                        size="default"
                        className="grow flex-row items-center gap-2 md:flex"
                    >
                        <Icons.pay className="h-4 w-4" />
                        Pay
                    </Button>
                </div>
                <Suspense fallback={<Skeleton className="w-full grow" />}>
                    <Transactions
                        data={getTransactions(params.address)}
                        accountAddress={params.address}
                    />
                </Suspense>
            </Container>
        </AuthChecker>
    );
}

export const metadata = {
    title: "Accounts",
};

export const revalidate = 0;
