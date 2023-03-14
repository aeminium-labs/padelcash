"use client";

import React from "react";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { useAtomValue, useSetAtom } from "jotai";
import { useForm } from "react-hook-form";

import { authProviderAtom, web3AuthAtom } from "@/lib/store";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type Props = {
    children: React.ReactNode;
};

type Inputs = {
    email: string;
};

export function LoginButtton({ children }: Props) {
    const web3auth = useAtomValue(web3AuthAtom);
    const setProvider = useSetAtom(authProviderAtom);
    const { register, getValues } = useForm<Inputs>();

    const onGoogleLoginClick = async () => {
        if (web3auth) {
            try {
                const web3authProvider = await web3auth.connectTo(
                    WALLET_ADAPTERS.OPENLOGIN,
                    {
                        mfaLevel: "none",
                        loginProvider: "google",
                    }
                );
                setProvider(web3authProvider);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const onTwitterLoginClick = async () => {
        if (web3auth) {
            try {
                const web3authProvider = await web3auth.connectTo(
                    WALLET_ADAPTERS.OPENLOGIN,
                    {
                        mfaLevel: "none",
                        loginProvider: "twitter",
                    }
                );
                setProvider(web3authProvider);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const onDiscordLoginClick = async () => {
        if (web3auth) {
            try {
                const web3authProvider = await web3auth.connectTo(
                    WALLET_ADAPTERS.OPENLOGIN,
                    {
                        mfaLevel: "none",
                        loginProvider: "discord",
                    }
                );
                setProvider(web3authProvider);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const onEmailLoginClick = async () => {
        if (web3auth?.status === "ready") {
            const email = getValues("email");

            try {
                const web3authProvider = await web3auth.connectTo(
                    WALLET_ADAPTERS.OPENLOGIN,
                    {
                        mfaLevel: "none",
                        loginProvider: "email_passwordless",
                        extraLoginOptions: {
                            login_hint: email,
                            domain: "https://auth.openlogin.com/",
                        },
                    }
                );
                setProvider(web3authProvider);
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Login to your Padelcash account
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-8">
                    <div className="self-center pt-4 text-center text-teal-500">
                        <Icons.logo className="h-28 w-28" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Button variant="subtle" onClick={onGoogleLoginClick}>
                            <Icons.google className="mr-2 h-4 w-4" /> Continue
                            with Google
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="subtle"
                                onClick={onTwitterLoginClick}
                            >
                                <Icons.twitter className="mr-2 h-4 w-4" />
                                Twitter
                            </Button>
                            <Button
                                variant="subtle"
                                onClick={onDiscordLoginClick}
                            >
                                <Icons.discord className="mr-2 h-4 w-4" />
                                Discord
                            </Button>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-4">
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
                        <Button variant="subtle" onClick={onEmailLoginClick}>
                            <Icons.mail className="mr-2 h-4 w-4" />
                            Continue with Email
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
