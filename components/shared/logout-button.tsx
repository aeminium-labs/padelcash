"use client";

import { useRouter } from "next/navigation";
import { LogoutResponse } from "@/app/api/logout/route";
import { useAtomValue, useSetAtom } from "jotai";

import { fetcher } from "@/lib/fetchers";
import { web3AuthAtom, web3AuthProviderAtom } from "@/lib/store";
import { Button } from "@/components/ui/button";

type Props = {
    children: React.ReactNode;
    disabled?: boolean;
};

export function LogoutButton({ children, disabled = false }) {
    const web3auth = useAtomValue(web3AuthAtom);
    const setProvider = useSetAtom(web3AuthProviderAtom);
    const router = useRouter();

    const onLogoutClick = async () => {
        if (web3auth) {
            try {
                const userInfo = await web3auth.getUserInfo();
                await web3auth.logout();
                await fetcher<LogoutResponse>(`/api/logout`, {
                    method: "POST",
                    body: JSON.stringify({
                        token: userInfo.oAuthAccessToken,
                    }),
                });

                setProvider(null);
                router.push("/");
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={onLogoutClick}
            disabled={disabled}
        >
            {children}
        </Button>
    );
}
