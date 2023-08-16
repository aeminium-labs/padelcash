"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";

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
            const payRes = await fetch(`/api/pay/retrieve`, {
                method: "POST",
                body: JSON.stringify({
                    code,
                }),
            });

            if (payRes.ok) {
                const data = await payRes.json();

                if (!isLoading && data) {
                    router.push(
                        `/account/${accountAddress}/payments?${data.params}`
                    );
                }
            }
        }

        checkData();
    }, [accountAddress, code, isLoading]);

    return (
        <Container>
            <Skeleton className="h-24 w-full" />
        </Container>
    );
}
