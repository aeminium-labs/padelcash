"use client";

import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";

import {
    connectionStatusAtom,
    loadableAccountsAtom,
    web3AuthProviderAtom,
} from "@/lib/store";
import { Icons } from "@/components/icons";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    children: React.ReactNode;
    address: string;
};

export function AuthChecker({ children, address }: Props) {
    const connectionStatus = useAtomValue(connectionStatusAtom);
    const provider = useAtomValue(web3AuthProviderAtom);
    const accounts = useAtomValue(loadableAccountsAtom);
    const router = useRouter();

    const accountAddress =
        accounts.state === "hasData" && accounts.data ? accounts.data[0] : null;

    const isLoading =
        connectionStatus === "init" ||
        connectionStatus === "connecting" ||
        (connectionStatus === "connected" && !accountAddress);

    const isNotAuthorized =
        (connectionStatus === "ready" && !provider) ||
        (accountAddress && accountAddress !== address);

    if (isLoading) {
        return (
            <Container>
                <Skeleton className="h-36 w-full" />
            </Container>
        );
    }

    if (isNotAuthorized) {
        return (
            <Container>
                <div className="flex flex-col items-start gap-2">
                    <h1 className="max-w-[1280px] text-4xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl lg:leading-snug">
                        Uh oh!
                    </h1>
                    <p className="text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
                        Seems like you can't access this page, please return to
                        the homepage and login again
                    </p>
                </div>
                <Button
                    variant="default"
                    size="lg"
                    className="mt-8 flex w-full flex-row items-center gap-2"
                    onClick={() => {
                        router.push("/");
                    }}
                >
                    <Icons.undo className="h-4 w-4" /> Return home
                </Button>
            </Container>
        );
    }

    return children;
}
