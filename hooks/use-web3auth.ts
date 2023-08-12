"use client";

import { useEffect } from "react";
import { ADAPTER_EVENTS, CHAIN_NAMESPACES } from "@web3auth/base";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { useAtom, useSetAtom } from "jotai";

import {
    connectionStatusAtom,
    Status,
    web3AuthAtom,
    web3AuthProviderAtom,
} from "@/lib/store";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_KEY;

export function useWeb3Auth() {
    const [web3Auth, setWeb3Auth] = useAtom(web3AuthAtom);
    const setProvider = useSetAtom(web3AuthProviderAtom);
    const setConnectionStatus = useSetAtom(connectionStatusAtom);

    // Login for connecting to wallet
    useEffect(() => {
        const init = async () => {
            if (clientId) {
                try {
                    const chainConfig = {
                        chainNamespace: CHAIN_NAMESPACES.SOLANA,
                        chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
                        rpcTarget: `${location.protocol}//${location.host}/api/rpc`,
                        displayName: "Solana Mainnet",
                        blockExplorer: "https://explorer.solana.com",
                        ticker: "SOL",
                        tickerName: "Solana Token",
                    };

                    const web3authClient = new Web3AuthNoModal({
                        clientId,
                        web3AuthNetwork: "cyan",
                        chainConfig,
                    });

                    setWeb3Auth(web3authClient);

                    const privateKeyProvider = new SolanaPrivateKeyProvider({
                        config: { chainConfig },
                    });

                    const openloginAdapter = new OpenloginAdapter({
                        privateKeyProvider,
                        loginSettings: {
                            mfaLevel: "mandatory",
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
                            loginConfig: {
                                discord: {
                                    verifier: "padelcash-discord",
                                    typeOfLogin: "discord",
                                    clientId: "1138241706312089640",
                                },
                                google: {
                                    verifier: "padelcash-google",
                                    typeOfLogin: "google",
                                    clientId:
                                        "684724996220-uj3tjh4krlrs3p63uf2etqbng688nd8e.apps.googleusercontent.com",
                                },
                            },
                            mfaSettings: {
                                deviceShareFactor: {
                                    enable: true,
                                    priority: 1,
                                    mandatory: true,
                                },
                                backUpShareFactor: {
                                    enable: true,
                                    priority: 2,
                                    mandatory: false,
                                },
                                socialBackupFactor: {
                                    enable: true,
                                    priority: 3,
                                    mandatory: false,
                                },
                                passwordFactor: {
                                    enable: true,
                                    priority: 4,
                                    mandatory: false,
                                },
                            },
                        },
                    });

                    web3authClient.configureAdapter(openloginAdapter);

                    await web3authClient.init();

                    if (web3authClient.connected) {
                        setProvider(web3authClient.provider);
                    }

                    setConnectionStatus(web3authClient.status);
                } catch (e) {}
            }
        };

        init();
    }, []);

    // Subscribe to adapter events
    useEffect(() => {
        if (web3Auth) {
            web3Auth.on(ADAPTER_EVENTS.CONNECTED, () => {
                setConnectionStatus(web3Auth.status);
            });

            web3Auth.on(ADAPTER_EVENTS.CONNECTING, () => {
                setConnectionStatus(web3Auth.status);
            });

            web3Auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
                setConnectionStatus(web3Auth.status);
            });

            web3Auth.on(ADAPTER_EVENTS.ERRORED, () => {
                setConnectionStatus(web3Auth.status);
            });

            web3Auth.on(ADAPTER_EVENTS.ERRORED, () => {
                setConnectionStatus(web3Auth.status);
            });

            web3Auth.on(ADAPTER_EVENTS.READY, () => {
                setConnectionStatus(web3Auth.status);
            });

            web3Auth.on(ADAPTER_EVENTS.NOT_READY, () => {
                setConnectionStatus(web3Auth.status);
            });
        }

        return () => {
            if (web3Auth) {
                web3Auth.off(ADAPTER_EVENTS.CONNECTED, () => {
                    setConnectionStatus(web3Auth.status);
                });

                web3Auth.off(ADAPTER_EVENTS.CONNECTING, () => {
                    setConnectionStatus(web3Auth.status);
                });

                web3Auth.off(ADAPTER_EVENTS.DISCONNECTED, () => {
                    setConnectionStatus(web3Auth.status);
                });

                web3Auth.off(ADAPTER_EVENTS.ERRORED, (error) => {
                    setConnectionStatus(web3Auth.status);
                });

                web3Auth.off(ADAPTER_EVENTS.ERRORED, () => {
                    setConnectionStatus(web3Auth.status);
                });

                web3Auth.off(ADAPTER_EVENTS.READY, () => {
                    setConnectionStatus(web3Auth.status);
                });

                web3Auth.off(ADAPTER_EVENTS.NOT_READY, () => {
                    setConnectionStatus(web3Auth.status);
                });
            }
        };
    }, [web3Auth]);
}
