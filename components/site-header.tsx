"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { siteConfig } from "@/config/site";
import { getBalances } from "@/lib/fetchers";
import { authAtom, connectionStatusAtom, userAtom } from "@/lib/store";
import { Icons } from "@/components/icons";
import { PadelBalance } from "@/components/padelBalance";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

function SiteHeaderLoggedOut() {
    return (
        <>
            <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
            >
                <div
                    className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                        className: "text-slate-700 dark:text-slate-400",
                    })}
                >
                    <Icons.twitter className="h-5 w-5 fill-current" />
                    <span className="sr-only">Twitter</span>
                </div>
            </Link>
        </>
    );
}

function SiteHeaderLoggedIn() {
    const user = useAtomValue(userAtom);
    const { toast } = useToast();

    const router = useRouter();

    const accountAddress = (user && user.address) || "";

    if (accountAddress) {
        return (
            <>
                <Suspense fallback={<Skeleton className="h-6 w-full" />}>
                    <PadelBalance data={getBalances(accountAddress)} />
                </Suspense>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" className="px-3">
                                    <Icons.user className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        onClick={async () => {
                                            try {
                                                await navigator.clipboard.writeText(
                                                    accountAddress
                                                );

                                                toast({
                                                    title: "Wallet address copied to clipboard",
                                                });
                                            } catch (e) {
                                                toast({
                                                    title: "Error copying address",
                                                });
                                            }
                                        }}
                                    >
                                        Copy wallet address
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            router.push(
                                                `/account/${accountAddress}/settings`
                                            )
                                        }
                                        disabled={true}
                                    >
                                        Account
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => router.push(`/logout`)}
                                    >
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </div>
            </>
        );
    }

    return null;
}

export function SiteHeader() {
    const [connectionStatus, setConnectionStatus] =
        useAtom(connectionStatusAtom);
    const setUser = useSetAtom(userAtom);
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
                    setConnectionStatus("init");
                }
            }
        }

        checkLogin();
    }, [setConnectionStatus, setUser, auth]);

    const isClientSide = typeof window !== "undefined";
    const bodyClasses = isClientSide && document.querySelector("body");
    const hasProgressier = isClientSide && window.progressier;
    const isInApp =
        (bodyClasses &&
            bodyClasses.classList.contains("progressier-standalone")) ||
        (isClientSide &&
            hasProgressier &&
            window.progressier.native.standalone);

    return (
        <header className="fixed top-0 z-10 w-full border-b border-b-teal-700 bg-slate-900/90 backdrop-blur-xl">
            <div className="container flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
                {connectionStatus === "connected" &&
                (isInApp || !hasProgressier) ? (
                    <SiteHeaderLoggedIn />
                ) : (
                    <SiteHeaderLoggedOut />
                )}
            </div>
        </header>
    );
}
