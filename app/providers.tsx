"use client";

import { Provider as JotaiProvider } from "jotai";

import { store } from "@/lib/store";

export function Providers({ children }) {
    return <JotaiProvider store={store}>{children}</JotaiProvider>;
}
