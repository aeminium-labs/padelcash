import { AccountBalances } from "@/app/account/[address]/page";

import { PADEL_TOKEN, PADEL_TOKEN_VALUE } from "@/lib/constants";
import { formatValue } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

type Props = { data: Promise<AccountBalances>; label?: string };

export async function SolBalance({ data, label = "SOL balance" }: Props) {
    const { account } = await data;

    const solBalance = formatValue(
        account.balances.nativeBalance,
        account.balances.nativeBalanceDecimals
    );

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
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold mb-1">
                    {solBalance.toString()}{" "}
                    <span className="text-muted text-2xl">SOL</span>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                    ~ ${formatValue(account.balances.nativeBalanceUSD)} USDC
                </p>
                <Sheet>
                    <SheetTrigger className="w-full">
                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-full"
                        >
                            PADEL <Icons.transfer className="h-4 w-4 mx-4" />{" "}
                            SOL
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom">
                        <SheetHeader className="text-left">
                            <SheetTitle className="text-teal-500 ">
                                Convert PADEL / SOL
                            </SheetTitle>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </CardContent>
        </Card>
    );
}
