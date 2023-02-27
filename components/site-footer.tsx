import Link from "next/link";

import { siteConfig } from "@/config/site";

export function SiteFooter() {
    return (
        <footer className="container w-full">
            <div className="flex flex-col items-center justify-start gap-4 border-t border-t-slate-200 py-8 dark:border-t-slate-700 md:h-16 md:flex-row md:py-0">
                <p className="text-center text-sm leading-loose text-slate-600 dark:text-slate-400 md:text-right">
                    Built by{" "}
                    <Link
                        href={siteConfig.links.aeminium}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        aeminium labs
                    </Link>
                    . Powered by{" "}
                    <Link
                        href="https://solana.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        Solana
                    </Link>
                    .
                </p>
            </div>
        </footer>
    );
}
