"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAtom, useSetAtom } from "jotai";
import { useForm } from "react-hook-form";

import { login } from "@/lib/fetchers";
import { magic } from "@/lib/magic";
import { connectionStatusAtom, userAtom } from "@/lib/store";
import { getAppUrl } from "@/lib/utils";
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
    const [connectionStatus, setConnectionStatus] =
        useAtom(connectionStatusAtom);
    const setUser = useSetAtom(userAtom);
    const url = getAppUrl();
    const router = useRouter();

    // Local state
    const { register, getValues, handleSubmit, watch } = useForm<Inputs>();
    const [open, setOpen] = React.useState(false);

    const hasEmail = (watch("email") || "").length > 0;
    const shouldBeDisabled = connectionStatus === "connecting";

    const onEmailLoginSubmit = async () => {
        const email = getValues("email");

        // Log in using our email with Magic and store the returned DID token in a variable
        if (magic) {
            setConnectionStatus("connecting");

            try {
                const didToken = await magic.auth.loginWithMagicLink({
                    email,
                });

                // Send this token to our validation endpoint
                const loginRes = await login(didToken);

                // If successful, update our user state with their metadata and route to the dashboard
                if (loginRes.authenticated) {
                    const userMetadata = await magic.user.getInfo();
                    setUser(userMetadata);
                    setConnectionStatus("connected");
                    router.push(`${url}/account?firstTime=true`);
                } else {
                    setUser(null);
                    setConnectionStatus("errored");
                }
            } catch (error) {
                console.error(error);
                setUser(null);
                setConnectionStatus("errored");
            }
        }
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
                        If this is your first time, we'll automatically create a
                        new one.
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-8">
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
                                className="h-12"
                                {...register("email", {
                                    required: true,
                                })}
                            />
                        </div>
                        <Button
                            variant="default"
                            size="lg"
                            disabled={shouldBeDisabled || !hasEmail}
                            type="submit"
                            className="px-4"
                        >
                            Continue
                            <Icons.chevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
}
