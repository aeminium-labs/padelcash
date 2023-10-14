"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { siteConfig } from "@/config/site";
import { magic } from "@/lib/magic";
import { connectionStatusAtom, userAtom } from "@/lib/store";
import { trimWalletAddress } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

    const accountAddress = (user && user.publicAddress) || "";

    if (accountAddress) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="px-3">
                        {trimWalletAddress(accountAddress)}
                        <Icons.moreVertical className="ml-3 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() =>
                                router.push(`/account/${accountAddress}/`)
                            }
                        >
                            <Icons.app className="mr-2 h-4 w-4" />
                            Padelcash App
                        </DropdownMenuItem>
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
                            <Icons.copy className="mr-2 h-4 w-4" />
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
                            <Icons.settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => router.push(`/logout`)}
                        >
                            <Icons.logout className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return null;
}

export function SiteHeader() {
    const [connectionStatus, setConnectionStatus] =
        useAtom(connectionStatusAtom);
    const setUser = useSetAtom(userAtom);

    useEffect(() => {
        async function checkLogin() {
            if (magic) {
                // Check if the user is authenticated already
                setConnectionStatus("connecting");
                const isLoggedIn = await magic.user.isLoggedIn();
                if (isLoggedIn && magic) {
                    // Pull their metadata, update our state, and route to dashboard
                    const userData = await magic.user.getInfo();

                    setUser(userData);
                    setConnectionStatus("connected");
                } else {
                    setUser(null);
                    setConnectionStatus("errored");
                }
            }
        }

        checkLogin();
    }, [setConnectionStatus, setUser]);

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
        <header className="fixed top-0 z-10 w-full border-b border-b-teal-700 bg-slate-900/30 backdrop-blur-xl">
            <div className="container flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
                <Link
                    href="/"
                    className="flex items-center space-x-2 text-teal-500"
                >
                    <Icons.logo className="h-6 w-6" />
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        {connectionStatus === "connected" &&
                        (isInApp || !hasProgressier) ? (
                            <SiteHeaderLoggedIn />
                        ) : (
                            <SiteHeaderLoggedOut />
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
