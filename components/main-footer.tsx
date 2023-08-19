"use client";

import Link from "next/link";
import { useAtomValue } from "jotai";

import { connectionStatusAtom, loadableAccountsAtom } from "@/lib/store";
import { Icons } from "@/components/icons";
import { LoginButtton } from "@/components/shared/login-button";
import { Button } from "@/components/ui/button";

function FooterButton({
    accountAddress,
    shouldBeDisabled,
}: {
    accountAddress: string | null;
    shouldBeDisabled: boolean;
}) {
    const isClientSide = typeof window !== "undefined";
    const hasProgressier = isClientSide && window.progressier;
    const isInApp =
        isClientSide &&
        document
            .querySelector("body")
            ?.classList.contains("progressier-standalone");

    const isInstallable =
        hasProgressier && !isInApp && !window.progressier.native.installed;

    const isInstalled =
        isClientSide && hasProgressier && window.progressier.native.installed;

    if (isInstallable) {
        return (
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
        );
    }

    if (!isInApp && isInstalled) {
        return (
            <Link href="/go" target={"_blank"} className="w-full">
                <Button
                    className="flex flex-row items-center gap-2 w-full"
                    variant="default"
                    size="lg"
                >
                    <Icons.phone className="h-4 w-4" /> Open app
                </Button>
            </Link>
        );
    }

    if (accountAddress) {
        return (
            <Link
                href={`/account/${accountAddress}/`}
                target={isInApp ? "_self" : "_blank"}
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
        );
    }

    return (
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
    );
}

export function MainFooter() {
    const accounts = useAtomValue(loadableAccountsAtom);
    const connectionStatus = useAtomValue(connectionStatusAtom);

    const shouldBeDisabled =
        connectionStatus !== "ready" && connectionStatus !== "errored";

    const accountAddress =
        accounts.state === "hasData" && accounts.data ? accounts.data[0] : null;

    return (
        <footer className="container w-full fixed bottom-0 bg-slate-900 border-t border-t-slate-700 py-4 px-4 md:hidden">
            <div className="flex flex-col items-center justify-start gap-4 md:flex-row ">
                <FooterButton
                    accountAddress={accountAddress}
                    shouldBeDisabled={shouldBeDisabled}
                />
            </div>
        </footer>
    );
}
