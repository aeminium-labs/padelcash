import { PADEL_TOKEN, PADEL_TOKEN_VALUE } from "@/lib/constants";
import { formatValue } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Balances = {
    account: {
        balances: {
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

type Props = { data: Promise<Balances> };

export async function Balances({ data }: Props) {
    const { account } = await data;

    const padelToken = account.balances.tokens.find(
        (token) => token.mint === PADEL_TOKEN
    );

    const padelBalance = {
        native: formatValue(padelToken?.amount, padelToken?.decimals),
        usd: formatValue(
            (padelToken?.amount || 0) * PADEL_TOKEN_VALUE,
            padelToken?.decimals
        ),
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-teal-500">
                    Available balance
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold mb-1">
                    ${padelBalance.native.toString()}{" "}
                    <span className="text-muted text-2xl">PADEL</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    ~ ${padelBalance.usd?.toString()} USDC
                </p>
            </CardContent>
        </Card>
    );
}
