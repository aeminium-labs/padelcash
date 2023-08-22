"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";

import { retrievePaymentParams } from "@/lib/fetchers";
import { connectionStatusAtom, loadableAccountsAtom } from "@/lib/store";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

type Props = {
    params: {
        code: string;
    };
};

export default function PayPage({ params }: Props) {
    const connectionStatus = useAtomValue(connectionStatusAtom);
    const accounts = useAtomValue(loadableAccountsAtom);
    const router = useRouter();
    const { code } = params;

    const accountAddress =
        accounts.state === "hasData" && accounts.data ? accounts.data[0] : null;

    const isLoading =
        connectionStatus === "init" ||
        connectionStatus === "connecting" ||
        (connectionStatus === "connected" && !accountAddress);

    useEffect(() => {
        async function checkData() {
            const res = await retrievePaymentParams(code);

            if (!isLoading && res.params) {
                router.push(
                    `/account/${accountAddress}/payments?${res.params}`
                );
            }
        }

        if (code.length > 0) {
            checkData();
        }
    }, [accountAddress, code, isLoading, router]);

    return <LoadingSkeleton />;
}
