"use client";

import { SafeEventEmitterProvider } from "@web3auth/base";
import { Web3AuthCore } from "@web3auth/core";
import { atom } from "jotai";
import { loadable } from "jotai/utils";

import { RPC } from "@/lib/rpc";

export const web3AuthAtom = atom<Web3AuthCore | null>(null);

export const authProviderAtom = atom<SafeEventEmitterProvider | null>(null);

const accountsAtom = atom(async (get) => {
    const provider = get(authProviderAtom);
    if (!provider) {
        return null;
    }

    const rpc = new RPC(provider);
    return rpc.getAccounts();
});

const balanceAtom = atom(async (get) => {
    const provider = get(authProviderAtom);
    if (!provider) {
        return null;
    }

    const rpc = new RPC(provider);
    return rpc.getBalance();
});

export const loadableAccountsAtom = loadable(accountsAtom);
export const loadableBalanceAtom = loadable(balanceAtom);
