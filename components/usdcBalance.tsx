import { AccountBalances } from "@/app/account/[address]/page";

import { PADEL_TOKEN, USDC_TOKEN } from "@/lib/constants";
import { formatAdjustedValue, formatValue } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsdcSwap } from "@/components/usdc-swap";

type Props = { data: Promise<AccountBalances>; label?: string };

export async function UsdcBalance({ data, label = "USDC balance" }: Props) {
    const { account } = await data;

    const usdcToken = account.balances.tokens.find(
        (token) => token.mint === USDC_TOKEN
    );

    const padelToken = account.balances.tokens.find(
        (token) => token.mint === PADEL_TOKEN
    );

    const padelBalance = {
        native: formatAdjustedValue(padelToken?.amount, padelToken?.decimals),
        usd: formatValue(padelToken?.amountUSD),
    };

    const usdcBalance = {
        native: formatValue(usdcToken?.amount, usdcToken?.decimals),
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-teal-500">
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6 text-4xl font-bold">
                    ${usdcBalance.native.toString()}{" "}
                    <span className="text-2xl text-muted">USDC</span>
                </div>
                <UsdcSwap
                    padelBalance={padelBalance}
                    usdcBalance={usdcBalance}
                />
            </CardContent>
        </Card>
    );
}
