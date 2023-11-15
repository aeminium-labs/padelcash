"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAtom, useAtomValue } from "jotai";

import { authAtom, connectionStatusAtom, userAtom } from "@/lib/store";
import { Icons } from "@/components/icons";
import { Container } from "@/components/shared/container";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";

type Props = {
    children: React.ReactNode;
    address: string;
};

export function AuthChecker({ children, address }: Props) {
    const [connectionStatus, setConnectionStatus] =
        useAtom(connectionStatusAtom);
    const [user, setUser] = useAtom(userAtom);

    const auth = useAtomValue(authAtom);

    useEffect(() => {
        async function checkLogin() {
            if (auth) {
                if (!auth.getInstance()) {
                    auth.init();
                }

                // Check if the user is authenticated already
                setConnectionStatus("connecting");
                const isLoggedIn = await auth.isLoggedIn();
                if (isLoggedIn) {
                    // Pull their metadata, update our state, and route to dashboard
                    const userData = await auth.getUserInfo();

                    setUser(userData);
                    setConnectionStatus("connected");
                } else {
                    setUser(null);
                    setConnectionStatus("errored");
                }
            }
        }

        checkLogin();
    }, [setConnectionStatus, setUser, auth]);

    const isLoading =
        connectionStatus === "init" ||
        connectionStatus === "connecting" ||
        (connectionStatus === "connected" && !user);

    const isNotAuthorized =
        connectionStatus === "errored" || (user && user.address !== address);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (isNotAuthorized) {
        return (
            <Container>
                <div className="flex flex-col items-start gap-2">
                    <h1 className="max-w-[1280px] text-4xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl lg:leading-snug">
                        Uh oh!
                    </h1>
                    <p className="text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
                        Seems like you can't access this page, please return to
                        the homepage and login again
                    </p>
                </div>
                <Link href="/">
                    <Button
                        variant="default"
                        size="lg"
                        className="mt-8 flex w-full flex-row items-center gap-2"
                    >
                        <Icons.undo className="h-4 w-4" /> Return home
                    </Button>
                </Link>
            </Container>
        );
    }

    return children;
}
