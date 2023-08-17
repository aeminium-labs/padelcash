import { AccountBalances } from "@/app/account/[address]/page";

import { PADEL_TOKEN } from "@/lib/constants";
import { formatValue } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { data: Promise<AccountBalances>; label?: string };

export async function PadelBalance({
    data,
    label = "Available balance",
}: Props) {
    const { account } = await data;

    const padelToken = account.balances.tokens.find(
        (token) => token.mint === PADEL_TOKEN
    );

    const padelBalance = {
        native: formatValue(padelToken?.amount, padelToken?.decimals),
        usd: formatValue(padelToken?.amountUSD),
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-teal-500">
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold mb-1">
                    {padelBalance.native.toString()}{" "}
                    <span className="text-muted text-2xl">PADEL</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    ${padelBalance.usd?.toString()} USDC
                </p>
            </CardContent>
        </Card>
    );
}
