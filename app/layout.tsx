import { Poppins as FontSans } from "next/font/google";

import "@/styles/globals.css";

import Script from "next/script";
import { Providers } from "@/app/providers";

import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/toaster";

type Props = {
    children: React.ReactNode;
};

const fontSans = FontSans({
    weight: ["400", "700"],
    style: ["italic", "normal"],
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en" className={`${fontSans.variable} dark`}>
            <head>
                {process.env.NODE_ENV === "production" && (
                    <script
                        defer
                        src="https://progressier.app/c00Kg9Z1JBplPIq0ICqp/script.js"
                    ></script>
                )}
            </head>
            <body className="min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
                <Providers>
                    <SiteHeader />
                    {children}
                    <Toaster />
                </Providers>
            </body>
            <Script id="virtual-keyboard">
                {`if ("virtualKeyboard" in navigator) {
                    navigator.virtualKeyboard.overlaysContent = true;
                }`}
            </Script>
        </html>
    );
}

export const metadata = {
    title: {
        default: "Padelcash // A new Padel economy",
        template: "%s // Padelcash",
    },
    description:
        "Padel is about to enter the next digital era! Pay for lessons, buy your padel equipment and much more with Padelcash",
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon.png", type: "image/png" },
            { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
            { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        ],
    },
    manifest: "https://progressier.app/c00Kg9Z1JBplPIq0ICqp/progressier.json",
    openGraph: {
        title: "Padelcash // A new Padel economy",
        description:
            "Padel is about to enter the next digital era! Pay for lessons, buy your padel equipment and much more with Padelcash",
        url: "https://www.padel.cash",
        siteName: "Padelcash",
        images: [
            {
                url: "/og-padelcash.jpg",
                width: 1200,
                height: 612,
            },
        ],
        locale: "en-US",
        type: "website",
    },
    viewport: {
        width: "device-width",
        initialScale: 1,
        interactiveWidget: "resizes-content",
        userScalable: false,
        maximumScale: 1,
    },
};
