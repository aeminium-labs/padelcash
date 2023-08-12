"use client";

import React from "react";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { useAtomValue, useSetAtom } from "jotai";
import { useForm } from "react-hook-form";

import {
    connectionStatusAtom,
    web3AuthAtom,
    web3AuthProviderAtom,
} from "@/lib/store";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type Props = {
    children: React.ReactNode;
};

type Inputs = {
    email: string;
};

export function LoginButtton({ children }: Props) {
    const web3auth = useAtomValue(web3AuthAtom);
    const setProvider = useSetAtom(web3AuthProviderAtom);
    const connectionStatus = useAtomValue(connectionStatusAtom);

    // Local state
    const { register, getValues, handleSubmit, watch } = useForm<Inputs>();
    const [open, setOpen] = React.useState(false);

    const hasEmail = (watch("email") || "").length > 0;

    const onProviderClick =
        (provider: string, extra: Record<string, string> = {}) =>
        async () => {
            if (web3auth) {
                try {
                    const web3authProvider = await web3auth.connectTo(
                        WALLET_ADAPTERS.OPENLOGIN,
                        {
                            mfaLevel: "optional",
                            loginProvider: provider,
                            extraLoginOptions: extra,
                        }
                    );
                    if (web3auth.connected) {
                        setOpen(false);
                        setProvider(web3authProvider);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        };

    const onEmailLoginSubmit = async () => {
        const email = getValues("email");

        onProviderClick("email_passwordless", {
            login_hint: email,
            domain: "https://auth.openlogin.com/",
        })();
    };

    const shouldBeDisabled =
        connectionStatus !== "ready" && connectionStatus !== "errored";

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="bottom">
                <div className="flex flex-col gap-8">
                    <div className="self-center pt-4 text-center text-teal-500">
                        <Icons.logo className="h-28 w-28" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Button
                            variant="secondary"
                            onClick={onProviderClick("google")}
                            size="lg"
                            disabled={shouldBeDisabled}
                        >
                            <Icons.google className="mr-2 h-4 w-4" /> Continue
                            with Google
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="secondary"
                                onClick={onProviderClick("twitter")}
                                disabled={shouldBeDisabled}
                            >
                                <Icons.twitter className="mr-2 h-4 w-4" />
                                Twitter
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={onProviderClick("discord")}
                                disabled={shouldBeDisabled}
                            >
                                <Icons.discord className="mr-2 h-4 w-4" />
                                Discord
                            </Button>
                        </div>
                    </div>
                    <Separator />
                    <form
                        onSubmit={handleSubmit(onEmailLoginSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            autoComplete="off"
                            {...register("email", {
                                required: true,
                            })}
                        />
                        <Button
                            variant="secondary"
                            size="lg"
                            disabled={shouldBeDisabled || !hasEmail}
                            type="submit"
                        >
                            <Icons.mail className="mr-2 h-4 w-4" />
                            Continue with Email
                        </Button>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
}
