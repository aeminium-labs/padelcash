"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";

import { connectionStatusAtom, userAtom } from "@/lib/store";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

type Props = {
    params: {
        code: string;
    };
};

export default function PayPage({ params }: Props) {
    const connectionStatus = useAtomValue(connectionStatusAtom);
    const user = useAtomValue(userAtom);
    const router = useRouter();
    const { code } = params;

    const accountAddress = user && user.publicAddress;

    const isLoading =
        connectionStatus === "init" ||
        connectionStatus === "connecting" ||
        (connectionStatus === "connected" && !accountAddress);

    useEffect(() => {
        async function checkData() {
            if (!isLoading && accountAddress && code) {
                router.push(`/account/${accountAddress}/payments?code=${code}`);
            }
        }

        if (code.length > 0) {
            checkData();
        }
    }, [accountAddress, code, isLoading, router]);

    return <LoadingSkeleton />;
}
