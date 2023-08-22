"use client";

import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

import { Progress } from "@/components/ui/progress";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

type Props = {
    step: number;
    labels: Array<string>;
    children: React.ReactNode;
};

export function ConfirmationPanel({ step, labels, children }: Props) {
    const { width, height } = useWindowSize();
    return (
        <Sheet open={step > 0}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="bottom" hideCloseButton>
                <SheetHeader>
                    <SheetTitle className="text-teal-500">
                        Sending your transaction
                    </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-4">
                    <Progress value={step * 25} className="w-full" />
                    <p className="text-center text-muted-foreground">
                        {labels[step - 1]}
                    </p>
                    {step === 4 && (
                        <Confetti
                            width={width}
                            height={height}
                            confettiSource={{
                                x: 0,
                                y: 0,
                                w: width,
                                h: height,
                            }}
                        />
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
