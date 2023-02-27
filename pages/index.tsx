import Head from "next/head";

import { Icons } from "@/components/icons";
import { Layout } from "@/components/layout";
import { SignupButton } from "@/components/shared/signup-button";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function IndexPage() {
    return (
        <Layout>
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
            </Head>
            <section className="container grid items-center gap-12 pt-6 pb-8 md:py-10">
                <div className="flex flex-col items-start gap-2">
                    <h1 className="max-w-[1280px] text-4xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl lg:leading-snug">
                        Taking the World&apos;s fastest-growing sport into the{" "}
                        <span className="text-teal-500">next digital era</span>.
                    </h1>
                    <p className="text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
                        Padelcash is enabling a new padel economy: fast, secure
                        and with super low fees.
                    </p>
                </div>
                <div className="flex max-w-[980px] flex-col items-start gap-2">
                    <ul className="flex list-none flex-col gap-2 text-xl">
                        <li className="flex items-center gap-2">
                            <Icons.circleDot className="text-teal-400" /> Pay
                            for padel lessons
                        </li>
                        <li className="flex items-center gap-2">
                            <Icons.circleDot className="text-teal-400" /> Buy
                            padel equipment
                        </li>
                        <li className="flex items-center gap-2">
                            <Icons.circleDot className="text-teal-400" /> Book
                            padel courts
                        </li>
                        <li className="flex items-center gap-2">
                            <Icons.circleDot className="text-teal-400" /> Get
                            rewards for playing padel
                        </li>
                        <li className="flex items-center gap-2">
                            <Icons.circleDot className="text-teal-400" /> Invest
                            your earnings
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-4 md:flex-row">
                    <SignupButton>
                        <Button variant="default" size="lg">
                            I&apos;m interested!
                        </Button>
                    </SignupButton>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span tabIndex={0}>
                                    <Button
                                        disabled
                                        variant="outline"
                                        size="lg"
                                    >
                                        Read the Whitepaper
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>Soon!</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </section>
        </Layout>
    );
}
