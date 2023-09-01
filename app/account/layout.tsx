/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import Script from "next/script";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <Script
                strategy="beforeInteractive"
                src="https://progressier.app/c00Kg9Z1JBplPIq0ICqp/script.js"
            ></Script>
        </>
    );
}
