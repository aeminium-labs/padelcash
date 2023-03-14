import { Poppins as FontSans } from "next/font/google";

import "@/styles/globals.css";
import { Providers } from "@/app/providers";

import { SiteFooter } from "@/components/site-footer";
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
        <html lang="en" className={fontSans.variable}>
            <head />
            <body className="min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
                <Providers>
                    <SiteHeader />
                    {children}
                    <SiteFooter />
                    <Toaster />
                </Providers>
            </body>
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
            { url: "/favicon-16x16.png", type: "image/png", size: "16x16" },
            { url: "/favicon-32x32.png", type: "image/png", size: "32x32" },
        ],
        apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
        other: [
            {
                rel: "mask-icon",
                url: "/safari-pinned-tab.svg",
                color: "#2dd4bf",
            },
        ],
    },
    manifest: "/site.webmanifest",
    appleWebApp: {
        title: "Padelcash",
    },
    applicationName: "Padelcash",
    themeColor: "#0f172a",
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
};
