"use client";

import { ADAPTER_STATUS_TYPE, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { atom, createStore } from "jotai";
import { loadable } from "jotai/utils";

import { RPC } from "@/lib/rpc";

export const store = createStore();

export const web3AuthAtom = atom<Web3AuthNoModal | null>(null);
web3AuthAtom.debugLabel = "web3AuthAtom";

export const web3AuthProviderAtom = atom<SafeEventEmitterProvider | null>(null);
web3AuthProviderAtom.debugLabel = "web3AuthProviderAtom";

export type Status = ADAPTER_STATUS_TYPE | "init";

export const connectionStatusAtom = atom<Status>("init");
connectionStatusAtom.debugLabel = "connectionStatusAtom";

export const isConnectedAtom = atom<boolean>((get) => {
    const provider = get(web3AuthProviderAtom);
    const connectionStatus = get(connectionStatusAtom);
    const web3auth = get(web3AuthAtom);

    return (
        (web3auth?.status === "connected" &&
            connectionStatus === "connected" &&
            provider !== null) ||
        false
    );
});

const accountsAtom = atom(async (get) => {
    const provider = get(web3AuthProviderAtom);
    if (!provider) {
        return null;
    }

    const rpc = new RPC(provider);
    return rpc.getAccounts();
});
accountsAtom.debugLabel = "accountsAtom";

const balanceAtom = atom(async (get) => {
    const provider = get(web3AuthProviderAtom);
    if (!provider) {
        return null;
    }

    const rpc = new RPC(provider);
    return rpc.getBalance();
});
balanceAtom.debugLabel = "balanceAtom";

export const loadableAccountsAtom = loadable(accountsAtom);
loadableAccountsAtom.debugLabel = "loadableAccountsAtom";

export const loadableBalanceAtom = loadable(balanceAtom);
loadableBalanceAtom.debugLabel = "loadableBalanceAtom";
