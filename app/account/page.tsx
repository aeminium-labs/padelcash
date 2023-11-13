"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";

import { verifyBadge } from "@/lib/fetchers";
import { userAtom } from "@/lib/store";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function AccountPage() {
    const router = useRouter();
    const user = useAtomValue(userAtom);

    const userAddress = user?.address || null;

    useEffect(() => {
        async function checkUserBadge() {
            if (userAddress) {
                if (userAddress) {
                    // Check if has registered before
                    const { exists } = await verifyBadge(userAddress, "REG");

                    if (exists) {
                        router.push(`/account/${userAddress}`);
                    } else {
                        router.push(`/account/welcome`);
                    }
                }
            }
        }

        checkUserBadge();
    }, [router, userAddress]);

    return <LoadingSkeleton />;
}
