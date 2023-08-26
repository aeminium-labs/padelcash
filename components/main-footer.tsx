"use client";

import { useState } from "react";
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
    const [status, setStatus] = useState<
        "init" | "loaded" | "ready" | "installing" | "installed"
    >("init");

    const isClientSide = typeof window !== "undefined";
    const hasProgressier = isClientSide && window.progressier;
    const bodyClasses = isClientSide && document.querySelector("body");
    const isInApp =
        (bodyClasses &&
            bodyClasses.classList.contains("progressier-standalone")) ||
        (isClientSide &&
            hasProgressier &&
            window.progressier.native.standalone);

    const isInstallable =
        hasProgressier &&
        !isInApp &&
        !window.progressier.native.installed &&
        window.progressier.native.installable;

    const isInstalled =
        status === "installed" ||
        (isClientSide && hasProgressier && window.progressier.native.installed);

    function handleInstallClick() {
        if (window.progressier) {
            setStatus("installing");
            window.progressier.install();
        }
    }

    if (isInstallable) {
        return (
            <Button
                className="flex w-full flex-row items-center gap-2"
                variant="default"
                size="lg"
                onClick={handleInstallClick}
                disabled={status === "installing"}
            >
                <Icons.download className="h-4 w-4" /> Install
            </Button>
        );
    }

    if (!isInApp && isInstalled) {
        return (
            <Link href="/go" target="_blank" className="w-full">
                <Button
                    className="flex w-full flex-row items-center gap-2"
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
            <Link href={`/account/${accountAddress}/`} className="w-full">
                <Button
                    variant="default"
                    size="lg"
                    className="flex w-full flex-row items-center gap-2"
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
                className="flex w-full flex-row items-center gap-2"
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

    const isClientSide = typeof window !== "undefined";
    const hasProgressier = isClientSide && window.progressier;
    const isInstalled =
        isClientSide && hasProgressier && window.progressier.native.installed;

    return (
        <footer className="container fixed bottom-0 w-full border-t border-t-slate-700  bg-slate-900/40 p-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col items-center justify-start gap-4 md:flex-row ">
                {isClientSide && window.progressier.native.installed
                    ? "true"
                    : "false"}
                <FooterButton
                    accountAddress={accountAddress}
                    shouldBeDisabled={shouldBeDisabled}
                />
            </div>
        </footer>
    );
}
