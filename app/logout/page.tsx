"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogoutResponse } from "@/app/api/logout/route";
import { useAtomValue, useSetAtom } from "jotai";

import { fetcher } from "@/lib/fetchers";
import {
    connectionStatusAtom,
    web3AuthAtom,
    web3AuthProviderAtom,
} from "@/lib/store";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function LogoutPage() {
    const web3auth = useAtomValue(web3AuthAtom);
    const setConnectionStatus = useSetAtom(connectionStatusAtom);
    const setProvider = useSetAtom(web3AuthProviderAtom);
    const router = useRouter();

    useEffect(() => {
        async function logout() {
            if (web3auth) {
                try {
                    const userInfo = await web3auth.getUserInfo();

                    router.push("/");

                    setConnectionStatus("init");
                    await web3auth.logout();
                    setProvider(null);

                    await fetcher<LogoutResponse>(`/api/logout`, {
                        method: "POST",
                        body: JSON.stringify({
                            token: userInfo.oAuthAccessToken,
                        }),
                    });

                    router.push("/");
                } catch (e) {
                    console.log(e);
                }
            }
        }

        logout();
    }, [router, setConnectionStatus, setProvider, web3auth]);

    return <LoadingSkeleton />;
}
