"use client";

import { useState } from "react";

import { PADEL_TOKEN, SOL_TOKEN } from "@/lib/constants";
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
    solBalance: {
        native: number;
    };
};

export function SolSwap({ padelBalance, solBalance }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="w-full" asChild>
                <Button variant="secondary" size="lg" className="w-full">
                    PADEL <Icons.transfer className="mx-4 h-4 w-4" /> SOL
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
                <SheetHeader className="text-left">
                    <SheetTitle className="text-teal-500 ">
                        SOL Vault
                    </SheetTitle>
                    <SheetDescription>
                        Deposit your PADEL in your SOL vault or withdraw some
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
                            toToken={SOL_TOKEN}
                            toLabel="SOL"
                            onCloseClick={() => {
                                setOpen(false);
                            }}
                        />
                    </TabsContent>
                    <TabsContent value="usdcToPadel" className="pt-4">
                        <ConvertForm
                            fromToken={SOL_TOKEN}
                            fromLabel="SOL"
                            fromBalance={solBalance}
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
