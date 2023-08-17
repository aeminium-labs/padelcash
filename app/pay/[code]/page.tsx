"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PayRetrieveResponse } from "@/app/api/pay/retrieve/route";
import { useAtomValue } from "jotai";

import { fetcher } from "@/lib/fetchers";
import { connectionStatusAtom, loadableAccountsAtom } from "@/lib/store";
import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

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
            const res = await fetcher<PayRetrieveResponse>(
                `/api/pay/retrieve`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        code,
                    }),
                }
            );

            if (!isLoading && res.params) {
                router.push(
                    `/account/${accountAddress}/payments?${res.params}`
                );
            }
        }

        if (code.length > 0) {
            checkData();
        }
    }, [accountAddress, code, isLoading]);

    return (
        <Container>
            <Skeleton className="h-24 w-full" />
        </Container>
    );
}
