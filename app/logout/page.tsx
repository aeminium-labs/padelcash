"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";

import { magic } from "@/lib/magic";
import { connectionStatusAtom, userAtom } from "@/lib/store";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function LogoutPage() {
    const setConnectionStatus = useSetAtom(connectionStatusAtom);
    const setUser = useSetAtom(userAtom);
    const router = useRouter();

    useEffect(() => {
        async function logout() {
            if (magic) {
                await magic.user.logout();
                setConnectionStatus("init");
                setUser(null);
                router.push("/");
            }
        }

        logout();
    }, [router, setConnectionStatus, setUser]);

    return <LoadingSkeleton />;
}
