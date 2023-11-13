"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";

import { authAtom, connectionStatusAtom, userAtom } from "@/lib/store";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function LogoutPage() {
    const setConnectionStatus = useSetAtom(connectionStatusAtom);
    const setUser = useSetAtom(userAtom);
    const auth = useAtomValue(authAtom);
    const router = useRouter();

    useEffect(() => {
        async function logout() {
            if (auth) {
                await auth.logout();
                setConnectionStatus("init");
                setUser(null);
                router.push("/");
            }
        }

        logout();
    }, [router, setConnectionStatus, setUser, auth]);

    return <LoadingSkeleton />;
}
