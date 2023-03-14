import { BalanceStat } from "@/app/account/[address]/balance-stat";

import { PADEL_TOKEN, USDC_TOKEN } from "@/lib/constants";
import { formatValue } from "@/lib/utils";

type Balances = {
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
                }
            ];
        };
    };
};

type Props = { data: Promise<Balances> };

export async function Balances({ data }: Props) {
    const { account } = await data;

    const padelToken = account.balances.tokens.find(
        (token) => token.mint === PADEL_TOKEN
    );

    const usdcToken = account.balances.tokens.find(
        (token) => token.mint === USDC_TOKEN
    );

    const solBalance = {
        native: formatValue(
            account.balances.nativeBalance,
            account.balances.nativeBalanceDecimals
        ),
        usd: formatValue(account.balances.nativeBalanceUSD),
    };

    const padelBalance = {
        native: formatValue(padelToken?.amount, padelToken?.decimals),
        usd: formatValue(padelToken?.amount, padelToken?.decimals) * 0.1,
    };

    const usdcBalance = {
        native: formatValue(usdcToken?.amount, usdcToken?.decimals),
        usd: formatValue(usdcToken?.amount, usdcToken?.decimals),
    };

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <BalanceStat
                nativeValue={padelBalance.native.toString()}
                usdValue={padelBalance.usd?.toString()}
                label="PADEL"
            />

            <BalanceStat
                nativeValue={solBalance.native.toString()}
                usdValue={solBalance.usd?.toString()}
                label="SOL"
            />

            <BalanceStat
                nativeValue={usdcBalance.native.toString()}
                usdValue={usdcBalance.usd?.toString()}
                label="USDC"
            />
        </div>
    );
}
