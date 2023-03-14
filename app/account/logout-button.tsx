"use client";

import { useAtomValue, useSetAtom } from "jotai";

import { authProviderAtom, web3AuthAtom } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function LogoutButton({ children }) {
    const web3auth = useAtomValue(web3AuthAtom);
    const setProvider = useSetAtom(authProviderAtom);

    const onLogoutClick = async () => {
        if (web3auth) {
            try {
                await web3auth.logout();
                setProvider(null);
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
        >
            {children}
        </Button>
    );
}
