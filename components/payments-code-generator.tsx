"use client";

import { MouseEventHandler, useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

import { createPaymentCode } from "@/lib/fetchers";
import { getAppUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const amounts = ["5", "10", "25", "50", "100"];

function AmountButton({
    value,
    isActive,
    onClick,
}: {
    value: number;
    isActive: boolean;
    onClick: MouseEventHandler<HTMLButtonElement>;
}) {
    return (
        <Button
            onClick={onClick}
            variant={isActive ? "default" : "secondary"}
            size="lg"
            className="h-14 px-7"
        >
            <span className="flex flex-col gap-0 text-center">
                <span className="">{value} PADEL</span>
            </span>
        </Button>
    );
}

export function PaymentsCodeGenerator({ to }: { to: string }) {
    const [amount, setAmount] = useState<string>(amounts[0]);
    const [code, setCode] = useState<string>("");
    const prevAmount = useRef<string>("");
    const { toast } = useToast();
    const appUrl = getAppUrl();

    useEffect(() => {
        const parsedAmount = parseFloat(amount);

        async function createUrl() {
            const res = await createPaymentCode(to, parsedAmount);

            if (res.code) {
                setCode(res.code);
            }
        }

        if (prevAmount.current !== amount && parsedAmount > 0) {
            createUrl();
            prevAmount.current = amount;
        }
    }, [to, amount]);

    if (code.length === 0) {
        return <Skeleton className="w-full grow" />;
    }

    const hasOtherAmount = !amounts.includes(amount);

    return (
        <div className="flex flex-col gap-4">
            <div
                className="flex flex-col gap-1"
                onClick={async () => {
                    try {
                        await navigator.clipboard.writeText(
                            `${appUrl}/pay/${code}`
                        );

                        toast({
                            title: "Payment link copied to clipboard",
                        });
                    } catch (e) {
                        toast({
                            title: "Error copying payment link",
                        });
                    }
                }}
            >
                <div className="rounded-xl bg-primary p-8">
                    <QRCode value={code} className="w-full" size={300} />
                </div>
                <p className="text-center text-xs text-muted-foreground">
                    Tap to copy payment link
                </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {amounts.map((value) => (
                    <AmountButton
                        value={parseFloat(value)}
                        onClick={() => setAmount(value)}
                        isActive={value === amount}
                        key={`amount-button-${value}`}
                    />
                ))}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant={hasOtherAmount ? "default" : "secondary"}
                            size="lg"
                            className="h-14 px-7"
                        >
                            <span className="flex flex-col gap-0 text-center">
                                <span className="">Other amount</span>
                                <span className="text-xs text-muted-foreground">
                                    {amount} PADEL
                                </span>
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="keyboard-bottom">
                        <SheetHeader className="text-left">
                            <SheetTitle>Enter PADEL amount</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4 flex flex-col gap-2">
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                autoComplete="off"
                                className="h-12 text-lg"
                                autoFocus
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                }}
                            />
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="col-span-2 w-full"
                                    >
                                        Confirm
                                    </Button>
                                </SheetClose>
                            </SheetFooter>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
