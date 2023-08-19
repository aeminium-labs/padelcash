"use client";

import { MouseEventHandler, useEffect, useState } from "react";
import QRCode from "react-qr-code";

import { PADEL_TOKEN_VALUE } from "@/lib/constants";
import { createPaymentCode } from "@/lib/fetchers";
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

const amounts = [50, 100, 250, 500, 1000];

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
                <span className="text-xs text-muted-foreground">
                    ${value * PADEL_TOKEN_VALUE}
                </span>
            </span>
        </Button>
    );
}

export function QrCodeGenerator({ to }: { to: string }) {
    const [amount, setAmount] = useState(50);
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        async function createUrl() {
            const res = await createPaymentCode(`to=${to}&amount=${amount}`);

            if (res.code) {
                setUrl(res.code);
            }
        }

        createUrl();
    }, [to, amount]);

    if (url.length === 0) {
        return <Skeleton className="w-full grow" />;
    }

    const hasOtherAmount = !amounts.includes(amount);

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-primary p-8">
                <QRCode value={url} className="w-full" size={300} />
            </div>
            <div className="grid grid-cols-2 gap-2">
                {amounts.map((value) => (
                    <AmountButton
                        value={value}
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
                                onChange={(e) =>
                                    setAmount(parseInt(e.target.value))
                                }
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
