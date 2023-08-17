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
                <div className="text-4xl font-bold mb-6">
                    ${usdcBalance.toString()}{" "}
                    <span className="text-muted text-2xl">USDC</span>
                </div>
                <Sheet>
                    <SheetTrigger className="w-full">
                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-full"
                        >
                            PADEL <Icons.transfer className="h-4 w-4 mx-4" />{" "}
                            USDC
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom">test</SheetContent>
                </Sheet>
            </CardContent>
        </Card>
    );
}
