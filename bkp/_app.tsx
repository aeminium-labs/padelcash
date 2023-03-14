import type { AppProps } from "next/app";
import { Poppins as FontSans } from "next/font/google";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "next-themes";

import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
    weight: ["400", "700"],
    style: ["italic", "normal"],
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <style jsx global>{`
				:root {
					--font-sans: ${fontSans.style.fontFamily};
				}
			}`}</style>
            <JotaiProvider>
                <ThemeProvider attribute="class" defaultTheme="dark">
                    <Component {...pageProps} />
                    <Toaster />
                </ThemeProvider>
            </JotaiProvider>
        </>
    );
}
