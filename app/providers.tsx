"use client";

import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "next-themes";

import { store } from "@/lib/store";

export function Providers({ children }) {
    return (
        <JotaiProvider store={store}>
            <ThemeProvider attribute="class" defaultTheme="dark">
                {children}
            </ThemeProvider>
        </JotaiProvider>
    );
}
