"use client";

import { atom, createStore } from "jotai";
import { MagicUserMetadata } from "magic-sdk";

export const store = createStore();

export type Status = "init" | "connecting" | "connected" | "errored";

export const connectionStatusAtom = atom<Status>("init");
connectionStatusAtom.debugLabel = "connectionStatusAtom";

export const userAtom = atom<MagicUserMetadata | null>(null);
