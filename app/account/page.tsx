"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";

import { createBadge } from "@/lib/fetchers";
import { connectionStatusAtom, userAtom } from "@/lib/store";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function AccountPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useAtomValue(userAtom);
    const connectionStatus = useAtomValue(connectionStatusAtom);

    const isFirstTime = searchParams.has("firstTime");

    // useEffect(() => {
    //     async function registerUser() {
    //         if (user && user.publicAddress) {
    //             await createBadge(user.publicAddress, "registration");

    //             // Add registered tag
    //             if (window.progressier) {
    //                 window.progressier.add({
    //                     tags: "registered",
    //                 });
    //             }
    //         }
    //     }

    //     if (isFirstTime && user && user.publicAddress) {
    //         registerUser();
    //     }
    // }, [user, isFirstTime]);

    useEffect(() => {
        if (connectionStatus === "errored") {
            router.push(`/`);
        }
    }, [connectionStatus, router]);

    useEffect(() => {
        if (user && user.publicAddress) {
            // Registers wallet in Progressier
            if (window.progressier) {
                window.progressier.add({
                    wallet: user.publicAddress,
                });
            }

            router.push(`/account/${user.publicAddress}`);
        }
    }, [user, router]);

    return <LoadingSkeleton />;
}
