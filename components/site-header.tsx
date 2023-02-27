import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { SignupButton } from "@/components/shared/signup-button";
import { Button, buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-b-teal-200 bg-white dark:border-b-teal-700 dark:bg-slate-900">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <MainNav items={siteConfig.mainNav} />
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        <Link
                            href={siteConfig.links.github}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div
                                className={buttonVariants({
                                    size: "sm",
                                    variant: "ghost",
                                    className:
                                        "text-slate-700 dark:text-slate-400",
                                })}
                            >
                                <Icons.gitHub className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </div>
                        </Link>
                        <Link
                            href={siteConfig.links.twitter}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div
                                className={buttonVariants({
                                    size: "sm",
                                    variant: "ghost",
                                    className:
                                        "text-slate-700 dark:text-slate-400",
                                })}
                            >
                                <Icons.twitter className="h-5 w-5 fill-current" />
                                <span className="sr-only">Twitter</span>
                            </div>
                        </Link>
                        <Button variant="outline" disabled={true}>
                            Login
                        </Button>
                        <SignupButton>
                            <Button variant="default">Register</Button>
                        </SignupButton>
                    </nav>
                </div>
            </div>
        </header>
    );
}
