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
        <div className="flex grow flex-row items-center justify-between">
            <Link href="/" className="text-teal-500">
                <Icons.logo className="h-6 w-6" />
            </Link>
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
        </div>
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
                <div className="flex items-center justify-start">
                    <nav className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" className="px-3">
                                    <Icons.user className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
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
                                        Copy address
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
                <Suspense fallback={<Skeleton className="h-8 w-full" />}>
                    <PadelBalance data={getBalances(accountAddress)} />
                </Suspense>
            </>
        );
    }

    return <Skeleton className="h-8 w-full" />;
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
                    setConnectionStatus("errored");
                }
            }
        }

        checkLogin();
    }, [setConnectionStatus, setUser, auth]);

    return (
        <header className="fixed top-0 z-10 w-full border-b border-b-teal-700 bg-slate-900/90 backdrop-blur-xl">
            <div className="container flex h-16 items-center justify-start gap-3 px-4">
                {connectionStatus === "connected" ? (
                    <SiteHeaderLoggedIn />
                ) : (
                    <SiteHeaderLoggedOut />
                )}
            </div>
        </header>
    );
}
