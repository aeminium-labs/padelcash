"use client";

import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
    return (
        <JotaiProvider>
            <ThemeProvider attribute="class" defaultTheme="dark">
                {children}
            </ThemeProvider>
        </JotaiProvider>
    );
}
