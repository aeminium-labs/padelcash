"use client";

import Link from "next/link";
import { useAtomValue } from "jotai";

import { loadableAccountsAtom, web3AuthAtom } from "@/lib/store";
import { Icons } from "@/components/icons";
import { LoginButtton } from "@/components/shared/login-button";
import { Button } from "@/components/ui/button";

export function MainFooter() {
    const accounts = useAtomValue(loadableAccountsAtom);
    const web3auth = useAtomValue(web3AuthAtom);

    const accountAddress =
        accounts.state === "hasData" && accounts.data ? accounts.data[0] : null;

    return (
        <footer className="container w-full fixed bottom-0 dark:bg-slate-900  border-t border-t-slate-200  dark:border-t-slate-700  py-4">
            <div className="flex flex-col items-center justify-start gap-4 md:flex-row ">
                {accountAddress ? (
                    <Link
                        href={`/account/${accountAddress}/`}
                        className="w-full"
                    >
                        <Button
                            variant="default"
                            size="lg"
                            className="flex flex-row items-center gap-2 w-full"
                        >
                            <Icons.app className="h-4 w-4" /> Launch app
                        </Button>
                    </Link>
                ) : (
                    <LoginButtton>
                        <Button
                            variant="default"
                            size="lg"
                            className="flex flex-row items-center gap-2 w-full"
                            disabled={web3auth?.status !== "ready"}
                        >
                            <Icons.login className="h-4 w-4" /> Login
                        </Button>
                    </LoginButtton>
                )}
            </div>
        </footer>
    );
}
