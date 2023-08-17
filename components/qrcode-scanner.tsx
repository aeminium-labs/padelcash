"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AccountBalances } from "@/app/account/[address]/page";
import { Transaction } from "@solana/web3.js";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useAtomValue } from "jotai";

import { PADEL_TOKEN, PADEL_TOKEN_VALUE } from "@/lib/constants";
import { createTx, retrievePaymentParams, sendTx } from "@/lib/fetchers";
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

function ViewFinder() {
    return <></>;
}

export function QrCodeScanner({ data }: { data: AccountBalances }) {
    const [code, setCode] = useState<string>("");
    const [status, setStatus] = useState<
        "idle" | "sending" | "success" | "error"
    >("idle");
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const provider = useAtomValue(web3AuthProviderAtom);

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

    function handleRejectClick() {
        router.replace("?");
        setCode("");
    }

    async function handleAcceptClick() {
        // Create new transaction from API
        const createTxRes = await createTx({
            senderAddress: Array.isArray(from) ? from[0] : from,
            receiverAddress: Array.isArray(to) ? to[0] : to,
            amount: parseFloat(amount || "0"),
        });

        // Rebuild tx in client
        const tx = Transaction.from(Buffer.from(createTxRes.tx, "base64"));

        // Sign transaction
        if (provider) {
            const rpc = new RPC(provider);

            const signedTx = await rpc.signTransaction(tx);
            const sendTxRes = await sendTx(signedTx);

            alert(sendTxRes.txSignature);
            router.replace("?");
        }
    }

    if (hasTx && data) {
        const padelToken = data.account.balances.tokens.find(
            (token) => token.mint === PADEL_TOKEN
        );

        const padelBalance = {
            native: formatValue(padelToken?.amount, padelToken?.decimals),
            usd: formatValue(padelToken?.amountUSD),
        };

        const parsedAmount = parseInt(amount);
        const hasEnoughBalance = padelBalance.native - parsedAmount > 0;

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
                        disabled={status !== "idle"}
                    >
                        Reject
                    </Button>
                    <Button
                        size="lg"
                        disabled={!hasEnoughBalance || status !== "idle"}
                        variant="success"
                        onClick={handleAcceptClick}
                    >
                        Approve
                    </Button>
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
