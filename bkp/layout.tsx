import Head from "next/head";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <>
            <Head>
                <title>Padelcash // A new Padel economy</title>
                <meta
                    name="description"
                    content="Padel is about to enter the next digital era! Pay for lessons, buy your padel equipment and much more with Padelcash"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="icon" type="image/png" href="/favicon.png" />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
                <link
                    rel="mask-icon"
                    href="/safari-pinned-tab.svg"
                    color="#2dd4bf"
                />
                <meta name="apple-mobile-web-app-title" content="Padelcash" />
                <meta name="application-name" content="Padelcash" />
                <meta name="msapplication-TileColor" content="#00aba9" />
                <meta name="theme-color" content="#0f172a" />
                <meta
                    property="og:title"
                    content="Padelcash // A new Padel economy"
                />
                <meta property="og:site_name" content="Padelcash" />
                <meta property="og:url" content="https://www.padel.cash" />
                <meta
                    property="og:description"
                    content="Padel is about to enter the next digital era! Pay for lessons, buy your padel equipment and much more with Padelcash"
                />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/og-padelcash.jpg" />
            </Head>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
        </>
    );
}
