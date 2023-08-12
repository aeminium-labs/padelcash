"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWeb3Auth } from "@/hooks/use-web3auth";
import { useAtomValue, useSetAtom } from "jotai";

import { siteConfig } from "@/config/site";
import {
    connectionStatusAtom,
    isConnectedAtom,
    loadableAccountsAtom,
    web3AuthAtom,
    web3AuthProviderAtom,
} from "@/lib/store";
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
    const accounts = useAtomValue(loadableAccountsAtom);
    const web3auth = useAtomValue(web3AuthAtom);
    const setProvider = useSetAtom(web3AuthProviderAtom);
    const isConnected = useAtomValue(isConnectedAtom);
    const setConnectionStatus = useSetAtom(connectionStatusAtom);

    const router = useRouter();

    const accountAddress =
        accounts.state === "hasData" && accounts.data ? accounts.data[0] : "";

    useEffect(() => {
        async function registerUser() {
            if (accountAddress.length > 0 && web3auth) {
                const userInfo = await web3auth.getUserInfo();
                await fetch(`/api/register/${accountAddress}`, {
                    method: "POST",
                    body: JSON.stringify({
                        email: userInfo.email,
                        name: userInfo.name,
                    }),
                });
            }
        }

        if (isConnected) {
            registerUser();
        }
    }, [accountAddress, web3auth, isConnected]);

    const onLogoutClick = async () => {
        if (web3auth) {
            try {
                const userInfo = await web3auth.getUserInfo();

                router.push("/");

                setConnectionStatus("init");
                await web3auth.logout();
                setProvider(null);

                await fetch(`/api/logout`, {
                    method: "POST",
                    body: JSON.stringify({
                        token: userInfo.oAuthAccessToken,
                    }),
                });
            } catch (e) {
                console.log(e);
            }
        }
    };

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
                        <DropdownMenuItem onClick={onLogoutClick}>
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
    useWeb3Auth();

    const isConnected = useAtomValue(isConnectedAtom);

    return (
        <header className="w-full border-b border-b-teal-200 bg-white dark:border-b-teal-700 dark:bg-slate-900">
            <div className="container px-4 flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <Link
                    href="/"
                    className="items-center space-x-2 text-teal-500 flex"
                >
                    <Icons.logo className="h-6 w-6" />
                    <span className="font-bold sm:inline-block">
                        {siteConfig.name}
                    </span>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        {isConnected ? (
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
