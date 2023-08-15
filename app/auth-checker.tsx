"use client";

import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";

import {
    connectionStatusAtom,
    loadableAccountsAtom,
    web3AuthProviderAtom,
} from "@/lib/store";
import { Icons } from "@/components/icons";
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
            <section className="container grid items-center gap-6 pt-6 px-4">
                <Skeleton className="h-24 w-full" />
            </section>
        );
    }

    if (isNotAuthorized) {
        return (
            <>
                <section className="container grid items-center gap-6 pt-6 px-4">
                    <div className="flex flex-col items-start gap-2">
                        <h1 className="max-w-[1280px] text-4xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl lg:leading-snug">
                            Uh oh!
                        </h1>
                        <p className="text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
                            Seems like you can't access this page, please return
                            to the homepage and login again
                        </p>
                    </div>
                    <Button
                        variant="default"
                        size="lg"
                        className="flex flex-row items-center gap-2 w-full mt-8"
                        onClick={() => {
                            router.push("/");
                        }}
                    >
                        <Icons.undo className="h-4 w-4" /> Return home
                    </Button>
                </section>
            </>
        );
    }

    return children;
}
