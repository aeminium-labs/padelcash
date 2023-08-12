"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";

import { connectionStatusAtom, web3AuthProviderAtom } from "@/lib/store";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

type Props = {
    children: React.ReactNode;
};

export function AuthChecker({ children }: Props) {
    const connectionStatus = useAtomValue(connectionStatusAtom);
    const provider = useAtomValue(web3AuthProviderAtom);
    const router = useRouter();

    if (connectionStatus === "init") {
        return <div>Loading</div>;
    }

    if (connectionStatus === "ready" && !provider) {
        return (
            <>
                <section className="container grid items-center gap-12 pt-6 pb-8 md:py-16">
                    <div className="flex flex-col items-start gap-2">
                        <h1 className="max-w-[1280px] text-4xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl lg:leading-snug">
                            Uh oh!
                        </h1>
                        <p className="text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
                            Seems like you can't access this page, please return
                            to the homepage and login again
                        </p>
                    </div>
                </section>
                <footer className="container w-full fixed bottom-0 dark:bg-slate-900  border-t border-t-slate-200  dark:border-t-slate-700  py-4">
                    <div className="flex flex-col items-center justify-start gap-4 md:flex-row ">
                        <Button
                            variant="default"
                            size="lg"
                            className="flex flex-row items-center gap-2 w-full"
                            onClick={() => {
                                router.push("/");
                            }}
                        >
                            <Icons.undo className="h-4 w-4" /> Return home
                        </Button>
                    </div>
                </footer>
            </>
        );
    }

    return children;
}
