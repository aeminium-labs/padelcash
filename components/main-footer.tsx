"use client";

import Link from "next/link";
import { useAtomValue } from "jotai";

import { connectionStatusAtom, loadableAccountsAtom } from "@/lib/store";
import { Icons } from "@/components/icons";
import { LoginButtton } from "@/components/shared/login-button";
import { Button } from "@/components/ui/button";

export function MainFooter() {
    const accounts = useAtomValue(loadableAccountsAtom);
    const connectionStatus = useAtomValue(connectionStatusAtom);

    const shouldBeDisabled =
        connectionStatus !== "ready" && connectionStatus !== "errored";

    const accountAddress =
        accounts.state === "hasData" && accounts.data ? accounts.data[0] : null;

    const isInstallable =
        (!document
            .querySelector("body")
            ?.classList.contains("progressier-standalone") &&
            window.progressier) ||
        false;

    return (
        <footer className="container w-full fixed bottom-0 bg-slate-900 border-t border-t-slate-700 py-4 px-4 md:hidden">
            <div className="flex flex-col items-center justify-start gap-4 md:flex-row ">
                {isInstallable ? (
                    <Button
                        className="flex flex-row items-center gap-2 w-full"
                        variant="default"
                        size="lg"
                        onClick={() => {
                            if (window.progressier) {
                                window.progressier.install();
                            }
                        }}
                    >
                        <Icons.download className="h-4 w-4" /> Install
                    </Button>
                ) : accountAddress ? (
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
                            disabled={shouldBeDisabled}
                        >
                            <Icons.login className="h-4 w-4" /> Login
                        </Button>
                    </LoginButtton>
                )}
            </div>
        </footer>
    );
}
