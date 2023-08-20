import { AccountBalances } from "@/app/account/[address]/page";

import { PADEL_TOKEN } from "@/lib/constants";
import { formatAdjustedValue, formatValue } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
    data: Promise<AccountBalances>;
    label?: string;
    variant?: "default" | "small";
};

export async function PadelBalance({
    data,
    label = "Available balance",
    variant = "default",
}: Props) {
    const { account } = await data;

    const padelToken = account.balances.tokens.find(
        (token) => token.mint === PADEL_TOKEN
    );

    const padelBalance = {
        native: formatAdjustedValue(padelToken?.amount, padelToken?.decimals),
        usd: formatValue(padelToken?.amountUSD),
    };

    if (variant === "small") {
        return (
            <Card className="flex flex-row items-center justify-between">
                <CardHeader className="pr-0">
                    <CardTitle className="text-sm font-medium text-teal-500">
                        {label}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pl-2">
                    <div className="text-lg font-bold">
                        {padelBalance.native.toString()}{" "}
                        <span className="text-sm text-muted">PADEL</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-teal-500">
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-1 text-4xl font-bold">
                    {padelBalance.native.toString()}{" "}
                    <span className="text-2xl text-muted">PADEL</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    ${padelBalance.usd?.toString()} USDC
                </p>
            </CardContent>
        </Card>
    );
}
