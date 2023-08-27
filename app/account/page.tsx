"use client";

import { useEffect } from "react";
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

    const accountAddress =
        accounts.state === "hasData" && accounts.data ? accounts.data[0] : null;

    const isLoading =
        connectionStatus === "init" ||
        connectionStatus === "connecting" ||
        (connectionStatus === "connected" && !accountAddress);

    const isFirstTime = searchParams.get("firstTime") === "true" || false;

    useEffect(() => {
        async function registerUser() {
            if (accountAddress && accountAddress.length > 0) {
                await createBadge(accountAddress, "registration");
            }
        }

        if (isFirstTime && accountAddress && accountAddress.length > 0) {
            registerUser();
        }
    }, [accountAddress, isFirstTime]);

    useEffect(() => {
        if (!isLoading && accountAddress && accountAddress.length > 0) {
            router.push(`/account/${accountAddress}`);
        }
    }, [accountAddress, isLoading, router]);

    return <LoadingSkeleton />;
}
