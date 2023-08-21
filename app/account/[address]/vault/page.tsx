import { Suspense } from "react";
import { AccountBalances } from "@/app/account/[address]/page";
import { AuthChecker } from "@/app/auth-checker";
import { gql } from "graphql-request";

import { graphQLClient } from "@/lib/graphql";
import { PadelBalance } from "@/components/padelBalance";
import { Container } from "@/components/shared/container";
import { SolBalance } from "@/components/solBalance";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { UsdcBalance } from "@/components/usdcBalance";

type Props = {
    params: {
        address: string;
    };
};

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

    return graphQLClient.request<AccountBalances>(query, { address });
};

export default async function BadgesPage({ params }: Props) {
    const balances = getBalances(params.address);

    return (
        <AuthChecker address={params.address}>
            <Container>
                <Suspense fallback={<Skeleton className="w-full grow" />}>
                    <PadelBalance data={balances} label="Wallet" />
                    <div className="relative py-4">
                        <Separator />
                        <span className="absolute left-1/2 top-1 -translate-x-1/2 bg-slate-900 p-1 text-xs uppercase text-slate-700">
                            Vaults
                        </span>
                    </div>
                    <UsdcBalance data={balances} label="USDC Vault" />
                    <SolBalance data={balances} label="SOL Vault" />
                </Suspense>
            </Container>
        </AuthChecker>
    );
}
export const metadata = {
    title: "Vault",
};
