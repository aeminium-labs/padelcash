"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";

import { createBadge } from "@/lib/fetchers";
import { connectionStatusAtom, loadableAccountsAtom } from "@/lib/store";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function AccountPage() {
    const connectionStatus = useAtomValue(connectionStatusAtom);
    const accounts = useAtomValue(loadableAccountsAtom);
    const router = useRouter();
    const searchParams = useSearchParams();

    const isFirstTime = searchParams.has("firstTime");
    const [isRegistering, setIsRegistering] = useState(false);

    const accountAddress =
        accounts.state === "hasData" && accounts.data ? accounts.data[0] : null;

    const isLoading =
        connectionStatus === "init" ||
        connectionStatus === "connecting" ||
        (connectionStatus === "connected" && !accountAddress);

    useEffect(() => {
        async function registerUser() {
            if (accountAddress && accountAddress.length > 0) {
                await createBadge(accountAddress, "registration");

                // Add registered tag
                if (window.progressier) {
                    window.progressier.add({
                        tags: "registered",
                    });
                }
            }
        }

        if (
            isFirstTime &&
            !isRegistering &&
            accountAddress &&
            accountAddress.length > 0
        ) {
            setIsRegistering(true);
            registerUser();
        }
    }, [accountAddress, isFirstTime, isRegistering]);

    useEffect(() => {
        if (!isLoading && accountAddress && accountAddress.length > 0) {
            // Registers wallet in Progressier
            if (window.progressier) {
                window.progressier.add({
                    wallet: accountAddress,
                });
            }

            router.push(`/account/${accountAddress}`);
        }
    }, [accountAddress, isLoading, router]);

    return <LoadingSkeleton />;
}
