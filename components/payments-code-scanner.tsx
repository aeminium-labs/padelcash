"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AccountBalances } from "@/app/account/[address]/page";
import { PayRetrieveResponse } from "@/app/api/pay/retrieve/route";
import { Transaction } from "@solana/web3.js";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { gql } from "graphql-request";
import { useAtomValue } from "jotai";

import { PADEL_TOKEN, TOKEN_MULTIPLIER } from "@/lib/constants";
import {
    confirmTx,
    createBadge,
    createTx,
    getTokenPrice,
    retrievePaymentParams,
    signRelayerTx,
} from "@/lib/fetchers";
import { graphQLClient } from "@/lib/graphql";
import { authAtom } from "@/lib/store";
import {
    formatAdjustedValue,
    formatValue,
    trimWalletAddress,
} from "@/lib/utils";
import { PadelBalance } from "@/components/padelBalance";
import { ConfirmationPanel } from "@/components/shared/confirmation-panel";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

function ViewFinder() {
    return <></>;
}

const getBalances = async (address: string) => {
    const query = gql`
        query getBalances($address: String!) {
            account(address: $address) {
                balances {
                    tokens {
                        amount
                        amountUSD
                        decimals
                        mint
                    }
                }
            }
        }
    `;

    return graphQLClient.request<AccountBalances>(query, { address });
};

export function PaymentsCodeScanner({
    balancesData,
}: {
    balancesData: AccountBalances;
}) {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [usdcValue, setUsdcValue] = useState(0);

    const from = Array.isArray(params.address)
        ? params.address[0]
        : params.address;

    const [code, setCode] = useState<string>(searchParams.get("code") || "");
    const [txParams, setTxParams] = useState<PayRetrieveResponse | null>(null);
    const [step, setStep] = useState<number>(0);
    const [currentTx, setCurrentTx] = useState<string>("");
    const lastTx = useRef<string>(currentTx);
    const auth = useAtomValue(authAtom);

    const to = txParams?.to || "";
    const amount = (txParams?.amount || 0) * TOKEN_MULTIPLIER;

    const hasTx = to && amount > 0;

    useEffect(() => {
        async function getUrl() {
            const res = await retrievePaymentParams(code);

            if (res.to && res.amount) {
                setTxParams(res);
            }
        }

        if (code.length > 0) {
            getUrl();
        }
    }, [router, code]);

    useEffect(() => {
        async function getConfirmation(tx: string) {
            const txStatus = await confirmTx(tx);

            if (txStatus.confirmed) {
                toast({
                    title: "Your transaction is confirmed!",
                });

                await createBadge(from, "firstTransaction");

                // Adds tags to progressier
                if (window.progressier) {
                    window.progressier.add({
                        tags: "firstTransaction",
                    });
                }
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
    }, [toast, currentTx, from]);

    useEffect(() => {
        async function getUsdcPrice(amount: number) {
            const res = await getTokenPrice(amount);

            if (res.value) {
                setUsdcValue(res.value);
            }
        }

        if (amount > 0) {
            getUsdcPrice(amount);
        }
    }, [amount]);

    function handleRejectClick() {
        setCode("");
    }

    async function handleAcceptClick() {
        setStep(1);

        // Create new transaction from API
        const createTxRes = await createTx({
            senderAddress: from,
            receiverAddress: Array.isArray(to) ? to[0] : to,
            amount,
        });

        setStep(2);

        // Rebuild tx in client
        const tx = Transaction.from(Buffer.from(createTxRes.tx, "base64"));

        // Sign transaction
        if (auth) {
            const signedTx = await auth.signTransaction(tx);

            setStep(3);

            const relayerTx = await signRelayerTx(signedTx);

            setCurrentTx(relayerTx.signedTx);
            setStep(4);

            // Redirect to home when done
            setTimeout(() => {
                router.push(`/account/${from}`);
            }, 2000);
        }
    }

    // Scanned but not parsed yet
    if (code.length > 0 && !hasTx) {
        return <Skeleton className="w-full grow" />;
    }

    // Scanned and parsed
    if (code.length > 0 && hasTx && balancesData) {
        const padelToken = balancesData.account.balances.tokens.find(
            (token) => token.mint === PADEL_TOKEN
        );

        if (padelToken) {
            const padelBalance = {
                native: formatAdjustedValue(
                    padelToken.amount * TOKEN_MULTIPLIER,
                    padelToken?.decimals
                ),
                usd: formatValue(padelToken.amountUSD),
            };

            const hasEnoughBalance = padelBalance.native - amount > 0;
            const labels = [
                "Preparing",
                "Signing",
                "Sending",
                `Sent ${formatAdjustedValue(amount)} PADEL`,
            ];
            const shouldBeDisabled =
                !hasEnoughBalance ||
                to === from ||
                step > 0 ||
                currentTx.length > 0;

            return (
                <Card className="flex grow flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg text-teal-500">
                            Transaction details
                        </CardTitle>
                        <CardDescription>
                            Please verify the details before approving
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grow">
                        <div className="flex flex-col gap-4">
                            <div className="flex grow flex-col gap-1 text-left">
                                <p className="text-xs text-muted-foreground">
                                    Receiver account
                                </p>
                                <p className="text-sm font-medium leading-none">
                                    {trimWalletAddress(to, 15)}
                                </p>
                            </div>
                            <div className="flex grow flex-col gap-1 text-left">
                                <p className="text-xs text-muted-foreground">
                                    Amount (PADEL)
                                </p>
                                <p className="text-sm font-medium leading-none">
                                    {formatAdjustedValue(amount)}
                                </p>
                            </div>
                            <div className="flex grow flex-col gap-1 text-left">
                                <p className="text-xs text-muted-foreground">
                                    Amount (USD)
                                </p>
                                <p className="text-sm font-medium leading-none">
                                    ${formatValue(usdcValue)}
                                </p>
                            </div>
                            <div className="flex grow flex-col gap-1 text-left">
                                <p className="text-xs text-muted-foreground">
                                    Current balance (PADEL)
                                </p>
                                <p className="text-sm font-medium leading-none">
                                    {formatAdjustedValue(padelBalance.native)}
                                </p>
                            </div>
                            <div className="flex grow flex-col gap-1 text-left">
                                <p className="text-xs text-muted-foreground">
                                    Balance after transaction (PADEL)
                                </p>
                                <p className="text-sm font-medium leading-none">
                                    {formatAdjustedValue(
                                        padelBalance.native - amount
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="grid grid-cols-3 gap-2">
                        <Button
                            variant="destructive"
                            size="lg"
                            onClick={handleRejectClick}
                            disabled={step > 0}
                        >
                            Reject
                        </Button>
                        <ConfirmationPanel step={step} labels={labels}>
                            <Button
                                size="lg"
                                disabled={shouldBeDisabled}
                                variant="success"
                                onClick={handleAcceptClick}
                                className="col-span-2"
                            >
                                Approve
                            </Button>
                        </ConfirmationPanel>
                    </CardFooter>
                </Card>
            );
        }
    }

    if (step > 0) {
        setStep(0);
    }

    return (
        <div className="flex grow flex-col gap-4">
            <Suspense fallback={<Skeleton className="h-20 w-full" />}>
                <PadelBalance
                    variant="small"
                    data={getBalances(from)}
                    label="Wallet"
                />
            </Suspense>
            <div className="relative flex w-full grow flex-col overflow-hidden rounded-xl">
                <Skeleton className="absolute h-full w-full grow" />
                <QrScanner
                    onDecode={(result) => {
                        setCode(result);
                    }}
                    onError={() => {}}
                    viewFinder={ViewFinder}
                    containerStyle={{ display: "flex", flexGrow: 1 }}
                    videoStyle={{ objectFit: "cover" }}
                />
            </div>
        </div>
    );
}
