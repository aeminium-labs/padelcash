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

    useEffect(() => {
        async function checkUserBadge() {
            if (user && user.publicAddress) {
                // Check if has registered before
                const { exists } = await verifyBadge(user.publicAddress, "REG");

                if (exists) {
                    router.push(`/account/${user.publicAddress}`);
                } else {
                    router.push(`/account/welcome`);
                }
            }
        }

        checkUserBadge();
    }, [user, router]);

    return <LoadingSkeleton />;
}
