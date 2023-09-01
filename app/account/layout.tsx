import Script from "next/script";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Script
                strategy="afterInteractive"
                src="https://progressier.app/c00Kg9Z1JBplPIq0ICqp/script.js"
            ></Script>
            {children}
        </>
    );
}
