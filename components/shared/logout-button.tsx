"use client";

import { useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";

import { authProviderAtom, web3AuthAtom } from "@/lib/store";
import { Button } from "@/components/ui/button";

type Props = {
    children: React.ReactNode;
    disabled?: boolean;
};

export function LogoutButton({ children, disabled = false }) {
    const web3auth = useAtomValue(web3AuthAtom);
    const setProvider = useSetAtom(authProviderAtom);
    const router = useRouter();

    const onLogoutClick = async () => {
        if (web3auth) {
            try {
                await web3auth.logout();
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
