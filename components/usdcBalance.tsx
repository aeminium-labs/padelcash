import { AccountBalances } from "@/app/account/[address]/page";

import { USDC_TOKEN } from "@/lib/constants";
import { formatValue } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type Props = { data: Promise<AccountBalances>; label?: string };

export async function UsdcBalance({ data, label = "USDC balance" }: Props) {
    const { account } = await data;

    const usdcToken = account.balances.tokens.find(
        (token) => token.mint === USDC_TOKEN
    );

    const usdcBalance = formatValue(usdcToken?.amount, usdcToken?.decimals);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-teal-500">
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6 text-4xl font-bold">
                    ${usdcBalance.toString()}{" "}
                    <span className="text-2xl text-muted">USDC</span>
                </div>
                <Sheet>
                    <SheetTrigger className="w-full">
                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-full"
                        >
                            PADEL <Icons.transfer className="mx-4 h-4 w-4" />{" "}
                            USDC
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom">test</SheetContent>
                </Sheet>
            </CardContent>
        </Card>
    );
}
