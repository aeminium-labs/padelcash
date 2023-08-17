"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AccountBalances } from "@/app/account/[address]/page";
import { QrScanner } from "@yudiel/react-qr-scanner";

import { PADEL_TOKEN, PADEL_TOKEN_VALUE } from "@/lib/constants";
import { formatValue, trimWalletAddress } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

function ViewFinder() {
    return <></>;
}

export function QrCodeScanner({ data }: { data: AccountBalances }) {
    const [code, setCode] = useState<string>("");
    const router = useRouter();
    const params = useSearchParams();

    const to = params.get("to");
    const amount = params.get("amount");

    const hasTx = to && amount;

    useEffect(() => {
        async function getUrl() {
            const res = await fetch(`/api/pay/retrieve`, {
                method: "POST",
                body: JSON.stringify({
                    code,
                }),
            });

            if (res.ok) {
                const data = await res.json();

                if (data.params) {
                    router.replace(`?${data.params}`);
                }
            }
        }

        if (code.length > 0) {
            getUrl();
        }
    }, [code]);

    function handleRejectClick() {
        router.replace("?");
        setCode("");
    }

    if (hasTx && data) {
        const padelToken = data.account.balances.tokens.find(
            (token) => token.mint === PADEL_TOKEN
        );

        const padelBalance = {
            native: formatValue(padelToken?.amount, padelToken?.decimals),
            usd: formatValue(padelToken?.amountUSD),
        };

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-teal-500">
                        Transaction details
                    </CardTitle>
                    <CardDescription>
                        Please verify the details before approving
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1 grow text-left">
                            <p className="text-xs text-muted-foreground">
                                Receiver account
                            </p>
                            <p className="text-sm font-medium leading-none">
                                {trimWalletAddress(to, 15)}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1 grow text-left">
                            <p className="text-xs text-muted-foreground">
                                Amount (PADEL)
                            </p>
                            <p className="text-sm font-medium leading-none">
                                {formatValue(parseInt(amount))}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1 grow text-left">
                            <p className="text-xs text-muted-foreground">
                                Amount (USD)
                            </p>
                            <p className="text-sm font-medium leading-none">
                                $
                                {formatValue(
                                    parseInt(amount) * PADEL_TOKEN_VALUE
                                )}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1 grow text-left">
                            <p className="text-xs text-muted-foreground">
                                Current balance (PADEL)
                            </p>
                            <p className="text-sm font-medium leading-none">
                                {formatValue(padelBalance.native)}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1 grow text-left">
                            <p className="text-xs text-muted-foreground">
                                Balance after transaction (PADEL)
                            </p>
                            <p className="text-sm font-medium leading-none">
                                {formatValue(
                                    padelBalance.native - parseInt(amount)
                                )}
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2">
                    <Button
                        variant="destructive"
                        size="lg"
                        onClick={handleRejectClick}
                    >
                        Reject
                    </Button>
                    <Button size="lg">Approve</Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="rounded-md overflow-hidden">
            <QrScanner
                onDecode={(result) => {
                    setCode(result);
                }}
                onError={(error) => console.log(error?.message)}
                viewFinder={ViewFinder}
                containerStyle={{ height: 500 }}
                videoStyle={{ objectFit: "cover" }}
            />
        </div>
    );
}
