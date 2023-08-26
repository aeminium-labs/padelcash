"use client";

import { useState } from "react";

import { PADEL_TOKEN, USDC_TOKEN } from "@/lib/constants";
import { Icons } from "@/components/icons";
import { ConvertForm } from "@/components/shared/convert-form";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
    padelBalance: {
        native: number;
        usd: number;
    };
    usdcBalance: {
        native: number;
    };
};

export function UsdcSwap({ padelBalance, usdcBalance }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="w-full" asChild>
                <Button variant="secondary" size="lg" className="w-full">
                    PADEL <Icons.transfer className="mx-4 h-4 w-4" /> USDC
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="keyboard-bottom">
                <SheetHeader className="text-left">
                    <SheetTitle className="text-teal-500 ">
                        USDC Vault
                    </SheetTitle>
                    <SheetDescription>
                        Deposit your PADEL in your USDC vault or withdraw some
                        back to your wallet
                    </SheetDescription>
                </SheetHeader>
                <Tabs defaultValue="padelToUsdc" className="py-4">
                    <TabsList className="mb-2 w-full">
                        <TabsTrigger value="padelToUsdc" className="w-full">
                            Deposit
                        </TabsTrigger>
                        <TabsTrigger value="usdcToPadel" className="w-full">
                            Withdraw
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="padelToUsdc" className="pt-4">
                        <ConvertForm
                            fromToken={PADEL_TOKEN}
                            fromLabel="PADEL"
                            fromBalance={padelBalance}
                            toToken={USDC_TOKEN}
                            toLabel="USDC"
                            onCloseClick={() => {
                                setOpen(false);
                            }}
                        />
                    </TabsContent>
                    <TabsContent value="usdcToPadel" className="pt-4">
                        <ConvertForm
                            fromToken={USDC_TOKEN}
                            fromLabel="USDC"
                            fromBalance={usdcBalance}
                            toToken={PADEL_TOKEN}
                            toLabel="PADEL"
                            onCloseClick={() => {
                                setOpen(false);
                            }}
                        />
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
