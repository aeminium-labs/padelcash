"use client";

import React from "react";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { useAtomValue, useSetAtom } from "jotai";
import { useForm } from "react-hook-form";

import { fetcher } from "@/lib/fetchers";
import { RPC } from "@/lib/rpc";
import {
    connectionStatusAtom,
    web3AuthAtom,
    web3AuthProviderAtom,
} from "@/lib/store";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

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
    const shouldBeDisabled =
        connectionStatus !== "ready" && connectionStatus !== "errored";

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

                    if (web3auth.connected && web3authProvider) {
                        setOpen(false);
                        setProvider(web3authProvider);

                        // Register user
                        const rpc = new RPC(web3authProvider);
                        const accounts = await rpc.getAccounts();

                        await fetcher(`/api/${accounts[0]}/register`, {
                            method: "POST",
                        });
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

    const handleOpenChange = (open) => {
        if (!shouldBeDisabled) {
            setOpen(open);
        }
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="bottom">
                <SheetHeader className="text-left">
                    <SheetTitle>Login to your account</SheetTitle>
                    <SheetDescription>
                        Use your preferred method to login to your Padelcash
                        account. If this is your first time, we'll automatically
                        create a new one.
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <Button
                            variant="secondary"
                            onClick={onProviderClick("google")}
                            size="lg"
                            disabled={shouldBeDisabled}
                        >
                            <Icons.google className="mr-2 h-4 w-4" /> Login with
                            Google
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
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <form
                        onSubmit={handleSubmit(onEmailLoginSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                autoComplete="off"
                                disabled={shouldBeDisabled}
                                {...register("email", {
                                    required: true,
                                })}
                            />
                        </div>
                        <Button
                            variant="secondary"
                            size="lg"
                            disabled={shouldBeDisabled || !hasEmail}
                            type="submit"
                        >
                            <Icons.mail className="mr-2 h-4 w-4" />
                            Login with Email
                        </Button>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
}
