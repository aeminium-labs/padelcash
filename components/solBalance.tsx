import { AccountBalances } from "@/app/account/[address]/page";

import { PADEL_TOKEN } from "@/lib/constants";
import { formatAdjustedValue, formatValue } from "@/lib/utils";
import { SolSwap } from "@/components/sol-swap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { data: Promise<AccountBalances>; label?: string };

export async function SolBalance({ data, label = "SOL balance" }: Props) {
    const { account } = await data;

    const padelToken = account.balances.tokens.find(
        (token) => token.mint === PADEL_TOKEN
    );

    const padelBalance = {
        native: formatAdjustedValue(padelToken?.amount, padelToken?.decimals),
        usd: formatValue(padelToken?.amountUSD),
    };

    const solBalance = {
        native: formatValue(
            account.balances.nativeBalance,
            account.balances.nativeBalanceDecimals
        ),
        usd: formatValue(account.balances.nativeBalanceUSD),
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-teal-500">
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-1 text-4xl font-bold">
                    {solBalance.native}{" "}
                    <span className="text-2xl text-muted">SOL</span>
                </div>
                <p className="mb-6 text-xs text-muted-foreground">
                    ${solBalance.usd} USDC
                </p>
                <SolSwap padelBalance={padelBalance} solBalance={solBalance} />
            </CardContent>
        </Card>
    );
}
