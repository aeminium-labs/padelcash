"use client";

import Link from "next/link";
import { useAtomValue } from "jotai";

import { connectionStatusAtom, userAtom } from "@/lib/store";
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
    const bodyClasses = isClientSide && document.querySelector("body");
    const isInApp =
        (bodyClasses &&
            bodyClasses.classList.contains("progressier-standalone")) ||
        (isClientSide &&
            hasProgressier &&
            window.progressier.native.standalone);

    const isInstallable =
        hasProgressier && !isInApp && !window.progressier.native.installed;

    const isInstalled =
        isClientSide && hasProgressier && window.progressier.native.installed;

    if (isInstallable) {
        return (
            <Button
                className="progressier-install-button flex w-full flex-row items-center gap-2"
                variant="default"
                size="lg"
                data-icons="false"
                data-install="Install app"
                data-installed="Launch app"
            />
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
            <Link href={`/account`} className="w-full">
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
    const user = useAtomValue(userAtom);
    const connectionStatus = useAtomValue(connectionStatusAtom);

    return (
        <footer className="container fixed bottom-0 w-full border-t border-t-slate-700 bg-slate-900/90 p-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col items-center justify-start gap-4 md:flex-row ">
                <FooterButton
                    accountAddress={user && user.publicAddress}
                    shouldBeDisabled={connectionStatus === "connecting"}
                />
            </div>
        </footer>
    );
}
