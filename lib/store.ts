"use client";

import { atom, createStore } from "jotai";

import { Auth } from "@/lib/auth-magic";

export const store = createStore();

export type Status = "init" | "connecting" | "connected" | "errored";

export const connectionStatusAtom = atom<Status>("init");
connectionStatusAtom.debugLabel = "connectionStatusAtom";

export const userAtom = atom<any>(null);

export const authAtom = atom<Auth>(new Auth());
