"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AccountBalances } from "@/app/account/[address]/page";
import { Transaction } from "@solana/web3.js";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useAtomValue } from "jotai";

import { PADEL_TOKEN, PADEL_TOKEN_VALUE } from "@/lib/constants";
import {
    confirmTx,
    createTx,
    retrievePaymentParams,
    signRelayerTx,
} from "@/lib/fetchers";
import { RPC } from "@/lib/rpc";
import { web3AuthProviderAtom } from "@/lib/store";
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
import { Progress } from "@/components/ui/progress";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

function ViewFinder() {
    return <></>;
}

export function QrCodeScanner({
    balancesData,
}: {
    balancesData: AccountBalances;
}) {
    const [code, setCode] = useState<string>("");
    const [step, setStep] = useState<number>(0);
    const [currentTx, setCurrentTx] = useState<string>("");
    const lastTx = useRef<string>(currentTx);
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const provider = useAtomValue(web3AuthProviderAtom);
    const { toast } = useToast();

    const from = params.address;
    const to = searchParams.get("to");
    const amount = searchParams.get("amount");

    const hasTx = to && amount;

    useEffect(() => {
        async function getUrl() {
            const res = await retrievePaymentParams(code);

            if (res.params) {
                router.replace(`?${res.params}`);
            }
        }

        if (code.length > 0) {
            getUrl();
        }
    }, [code]);

    useEffect(() => {
        async function getConfirmation(tx: string) {
            const txStatus = await confirmTx(tx);

            if (txStatus.confirmed) {
                toast({
                    title: "Your transaction is confirmed!",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "There was a problem completing your transaction",
                });
            }
        }

        if (currentTx !== lastTx.current && currentTx.length > 0) {
            getConfirmation(currentTx);
            lastTx.current = currentTx;
            setCurrentTx("");
        }
    }, [currentTx]);

    function handleRejectClick() {
        router.replace("?");
        setCode("");
    }

    async function handleAcceptClick() {
        setStep(1);

        // Create new transaction from API
        const createTxRes = await createTx({
            senderAddress: Array.isArray(from) ? from[0] : from,
            receiverAddress: Array.isArray(to) ? to[0] : to,
            amount: parseFloat(amount || "0"),
        });

        setStep(2);

        // Rebuild tx in client
        const tx = Transaction.from(Buffer.from(createTxRes.tx, "base64"));

        // Sign transaction
        if (provider) {
            const rpc = new RPC(provider);

            const signedTx = await rpc.signTransaction(tx);

            setStep(3);

            const relayerTx = await signRelayerTx(signedTx);

            setCurrentTx(relayerTx.signedTx);
            setStep(4);

            setTimeout(() => {
                router.replace("?");
                setCode("");
            }, 1500);
        }
    }

    if (hasTx && balancesData) {
        const padelToken = balancesData.account.balances.tokens.find(
            (token) => token.mint === PADEL_TOKEN
        );

        const padelBalance = {
            native: formatValue(padelToken?.amount, padelToken?.decimals),
            usd: formatValue(padelToken?.amountUSD),
        };

        const parsedAmount = parseInt(amount);
        const hasEnoughBalance = padelBalance.native - parsedAmount > 0;
        const labels = [
            "Preparing",
            "Signing",
            "Sending",
            `🎉 Sent ${amount} PADEL 🎉`,
        ];
        const shouldBeDisabled =
            !hasEnoughBalance || step > 0 || currentTx.length > 0;

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg text-teal-500">
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
                                {formatValue(parsedAmount)}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1 grow text-left">
                            <p className="text-xs text-muted-foreground">
                                Amount (USD)
                            </p>
                            <p className="text-sm font-medium leading-none">
                                ${formatValue(parsedAmount * PADEL_TOKEN_VALUE)}
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
                                    padelBalance.native - parsedAmount
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
                        disabled={step > 0}
                    >
                        Reject
                    </Button>
                    <Sheet open={step > 0}>
                        <SheetTrigger asChild>
                            <Button
                                size="lg"
                                disabled={shouldBeDisabled}
                                variant="success"
                                onClick={handleAcceptClick}
                            >
                                Approve
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" hideCloseButton>
                            <SheetHeader>
                                <SheetTitle className="text-teal-500">
                                    Sending your transaction
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 my-6">
                                <Progress
                                    value={step * 25}
                                    className="w-full"
                                />
                                <p className="text-muted-foreground text-center">
                                    {labels[step - 1]}
                                </p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </CardFooter>
            </Card>
        );
    }

    if (step > 0) {
        setStep(0);
    }

    return (
        <div className="rounded-md overflow-hidden">
            <QrScanner
                onDecode={(result) => {
                    setCode(result);
                }}
                onError={() => {}}
                viewFinder={ViewFinder}
                containerStyle={{ height: 500 }}
                videoStyle={{ objectFit: "cover" }}
            />
        </div>
    );
}
