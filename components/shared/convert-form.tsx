"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { GetQuoteResponse } from "@/app/api/token/quote/route";
import { Transaction } from "@solana/web3.js";
import { useAtomValue } from "jotai";

import { PADEL_TOKEN, TOKEN_MULTIPLIER } from "@/lib/constants";
import {
    confirmTx,
    getTokenQuote,
    getTokenSwapTransaction,
    signRelayerTx,
} from "@/lib/fetchers";
import { RPC } from "@/lib/rpc";
import { web3AuthProviderAtom } from "@/lib/store";
import { formatAdjustedValue, formatValue } from "@/lib/utils";
import { ConfirmationPanel } from "@/components/shared/confirmation-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

type Props = {
    fromToken: string;
    fromLabel: string;
    fromBalance: {
        native: number;
        usd?: number;
    };
    toToken: string;
    toLabel: string;
    onCloseClick: Function;
};

export function ConvertForm({
    fromToken,
    fromLabel,
    fromBalance,
    toToken,
    toLabel,
    onCloseClick,
}: Props) {
    const [fromValue, setFromValue] = useState<string>(`${fromBalance.native}`);
    const [quote, setQuote] = useState<GetQuoteResponse | null>(null);
    const params = useParams();
    const provider = useAtomValue(web3AuthProviderAtom);
    const [step, setStep] = useState<number>(0);
    const [currentTx, setCurrentTx] = useState<string>("");
    const lastTx = useRef<string>(currentTx);
    const { toast } = useToast();

    const address = Array.isArray(params.address)
        ? params.address[0]
        : params.address;

    useEffect(() => {
        async function fetchQuote(amount: number) {
            const quote = await getTokenQuote({
                fromToken,
                toToken,
                amount,
            });

            if (quote.value > 0) {
                // ATTENTION: need to use multiplier if using BONK as base token for pilot
                const parsedQuote = {
                    value:
                        toToken === PADEL_TOKEN
                            ? formatAdjustedValue(quote.value)
                            : formatValue(quote.value),
                    minimumValue:
                        toToken === PADEL_TOKEN
                            ? formatAdjustedValue(quote.minimumValue)
                            : formatValue(quote.minimumValue),
                    priceImpact: formatValue(quote.priceImpact),
                    quote: quote.quote,
                };

                setQuote(parsedQuote);
            }
        }

        // ATTENTION: need to use multiplier if using BONK as base token for pilot
        const parsedFromValue =
            fromToken === PADEL_TOKEN
                ? parseFloat(fromValue) * TOKEN_MULTIPLIER
                : parseFloat(fromValue);

        if (parsedFromValue > 0) {
            setQuote(null);
            fetchQuote(parsedFromValue);
        }
    }, [fromValue, fromToken, toToken, address]);

    useEffect(() => {
        async function getConfirmation(tx: string) {
            const txStatus = await confirmTx(tx);

            if (txStatus.confirmed) {
                toast({
                    title: "Your transaction is confirmed!",
                });

                // await createBadge(from, "firstTransaction");
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
    }, [toast, currentTx]);

    function handlePercentageClick(amount: number) {
        return () => {
            setFromValue(`${formatValue(fromBalance.native * amount)}`);
        };
    }

    async function handleConfirmClick() {
        setStep(1);

        if (quote) {
            // Create new transaction with current quote
            const getSwapTx = await getTokenSwapTransaction({
                address,
                quote: quote?.quote,
            });

            // Rebuild tx in client
            const tx = Transaction.from(
                Buffer.from(getSwapTx.swapTransaction, "base64")
            );

            setStep(2);

            // Sign transaction
            if (provider) {
                const rpc = new RPC(provider);

                const signedTx = await rpc.signTransaction(tx);

                setStep(3);

                const relayerTx = await signRelayerTx(signedTx);

                setCurrentTx(relayerTx.signedTx);
                setStep(4);

                // Cleanup and redirect to home
                setTimeout(() => {
                    setStep(0);
                    onCloseClick();
                }, 2000);
            }
        }
    }

    const fromInputLabel = fromToken === PADEL_TOKEN ? "Wallet" : "Vault";

    const toInputLabel =
        toToken === PADEL_TOKEN ? "Withdrawn to Wallet" : "Deposited to Vault";

    const percentages = [0.25, 0.5, 0.75, 1];

    const labels = [
        "Preparing",
        "Signing",
        "Sending",
        fromToken === PADEL_TOKEN ? "Deposit completed" : "Withdraw completed",
    ];

    const shouldBeDisabled = !quote;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Label
                    htmlFor="fromTokenInput"
                    className="flex flex-row justify-between"
                >
                    <span>
                        {fromInputLabel}{" "}
                        <span className="text-xs text-muted-foreground">
                            ({fromLabel})
                        </span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Available: {fromBalance.native} {fromLabel}
                    </span>
                </Label>
                <Input
                    id="fromTokenInput"
                    type="number"
                    value={fromValue}
                    onChange={(e) => {
                        setFromValue(e.target.value);
                    }}
                    autoComplete="off"
                />
                <div className="grid grid-cols-4 gap-1">
                    {percentages.map((percentage) => {
                        return (
                            <Button
                                key={`percentage-button-${percentage * 100}`}
                                size="sm"
                                variant="secondary"
                                onClick={handlePercentageClick(percentage)}
                            >
                                {`${percentage * 100}%`}
                            </Button>
                        );
                    })}
                </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4">
                <div className="flex grow flex-col gap-2 text-left">
                    <p className="text-md font-bold text-muted-foreground">
                        {toInputLabel}
                    </p>
                    {quote ? (
                        <p className="text-md h-4 font-medium leading-none">
                            {quote?.value} {toLabel}
                        </p>
                    ) : (
                        <Skeleton className="h-4 w-1/3" />
                    )}
                </div>
                <div className="flex grow flex-col gap-2 text-left">
                    <p className="text-xs text-muted-foreground">
                        Minium guaranteed
                    </p>
                    {quote ? (
                        <p className="h-4 text-sm font-medium leading-none">
                            {quote?.minimumValue} {toLabel}
                        </p>
                    ) : (
                        <Skeleton className="h-4 w-1/3" />
                    )}
                </div>
                <div className="flex grow flex-col gap-2 text-left">
                    <p className="text-xs text-muted-foreground">
                        Price impact
                    </p>
                    {quote ? (
                        <p className="h-4 text-sm font-medium leading-none">
                            {quote?.priceImpact}%
                        </p>
                    ) : (
                        <Skeleton className="h-4 w-1/3" />
                    )}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => {
                        onCloseClick && onCloseClick();
                    }}
                >
                    Cancel
                </Button>
                <ConfirmationPanel step={step} labels={labels}>
                    <Button
                        size="lg"
                        variant="success"
                        className="col-span-2"
                        onClick={handleConfirmClick}
                        disabled={shouldBeDisabled}
                    >
                        Confirm
                    </Button>
                </ConfirmationPanel>
            </div>
        </div>
    );
}
