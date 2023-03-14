"use client";

import { useEffect } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { usePathname, useRouter } from "next/navigation";
import {
    ADAPTER_EVENTS,
    CHAIN_NAMESPACES,
    CONNECTED_EVENT_DATA,
} from "@web3auth/base";
import { Web3AuthCore } from "@web3auth/core";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { useAtom, useSetAtom } from "jotai";

import { authProviderAtom, web3AuthAtom } from "@/lib/store";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_KEY;

const subscribeAuthEvents = ({
    web3auth,
    path,
    router,
}: {
    web3auth: Web3AuthCore;
    path: string;
    router: AppRouterInstance;
}) => {
    web3auth.on(
        ADAPTER_EVENTS.CONNECTED,
        async (data: CONNECTED_EVENT_DATA) => {
            console.log("connected to wallet", data);
        }
    );
    web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log("connecting");
    });
    web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log("disconnected");
    });
    web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.log("error", error);
    });
};

export function useWeb3Auth() {
    const [web3auth, setWeb3auth] = useAtom(web3AuthAtom);
    const setProvider = useSetAtom(authProviderAtom);
    const router = useRouter();
    const path = usePathname();

    useEffect(() => {
        const init = async () => {
            if (clientId) {
                try {
                    const web3auth = new Web3AuthCore({
                        clientId,
                        web3AuthNetwork: "cyan",
                        chainConfig: {
                            chainNamespace: CHAIN_NAMESPACES.SOLANA,
                            chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
                            rpcTarget: `${location.protocol}//${location.host}/api/rpc`,
                        },
                    });

                    const openloginAdapter = new OpenloginAdapter({
                        loginSettings: {
                            mfaLevel: "optional",
                        },
                        adapterSettings: {
                            whiteLabel: {
                                name: "Padelcash",
                                logoLight:
                                    "https://www.padel.cash/android-chrome-192x192.png",
                                logoDark:
                                    "https://www.padel.cash/android-chrome-192x192.png",
                                defaultLanguage: "en",
                                dark: true,
                            },
                        },
                    });

                    web3auth.configureAdapter(openloginAdapter);
                    setWeb3auth(web3auth);

                    await web3auth.init();
                    setProvider(web3auth.provider);
                } catch (e) {}
            }
        };

        if (!web3auth) {
            init();
        } else {
            subscribeAuthEvents({ web3auth, router, path });
        }

        return () => {};
    }, [setProvider, setWeb3auth, web3auth, router, path]);
}
