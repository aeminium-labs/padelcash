"use client";

import Link from "next/link";
import { useWeb3Auth } from "@/hooks/use-web3auth";
import { useAtomValue } from "jotai";

import { siteConfig } from "@/config/site";
import {
    authProviderAtom,
    loadableAccountsAtom,
    loadableBalanceAtom,
} from "@/lib/store";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { LoginButtton } from "@/components/shared/login-button";
import { Button, buttonVariants } from "@/components/ui/button";

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
            <LoginButtton>
                <Button variant="default">Login / Register</Button>
            </LoginButtton>
        </>
    );
}

function SiteHeaderLoggedIn() {
    const accounts = useAtomValue(loadableAccountsAtom);
    const balance = useAtomValue(loadableBalanceAtom);

    const accountAddress =
        accounts.state === "hasData" && accounts.data ? accounts.data[0] : null;
    const accountBalance = balance.state === "hasData" ? balance.data : 0;

    console.log(accountAddress);

    return <>{accountBalance && <div>{accountBalance}</div>}</>;
}

export function SiteHeader() {
    const provider = useAtomValue(authProviderAtom);

    useWeb3Auth();

    return (
        <header className="w-full border-b border-b-teal-200 bg-white dark:border-b-teal-700 dark:bg-slate-900">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <MainNav items={siteConfig.mainNav} />
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        {provider ? (
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
