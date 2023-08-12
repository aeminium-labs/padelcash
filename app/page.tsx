import Link from "next/link";

import { Icons } from "@/components/icons";
import { MainFooter } from "@/components/main-footer";
import { Button } from "@/components/ui/button";

export default function IndexPage() {
    return (
        <>
            <section className="container px-6 grid items-center gap-12 pt-6 pb-8 md:py-16 mb-20">
                <div className="flex flex-col items-start gap-2">
                    <h1 className="max-w-[1280px] text-4xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl lg:leading-snug">
                        Taking the World&apos;s fastest-growing sport into the
                        <br />
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
                            <Icons.circleDot className="h-5 w-5 text-teal-400" />{" "}
                            Pay for padel lessons
                        </li>
                        <li className="flex items-center gap-2">
                            <Icons.circleDot className="h-5 w-5 text-teal-400" />{" "}
                            Buy padel equipment
                        </li>
                        <li className="flex items-center gap-2">
                            <Icons.circleDot className="h-5 w-5 text-teal-400" />{" "}
                            Book padel courts
                        </li>
                        <li className="flex items-center gap-2">
                            <Icons.circleDot className="h-5 w-5 text-teal-400" />{" "}
                            Get rewards for playing padel
                        </li>
                        <li className="flex items-center gap-2">
                            <Icons.circleDot className="h-5 w-5 text-teal-400" />{" "}
                            Invest your earnings
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-4 md:flex-row">
                    <Link
                        href="https://bristle-citron-418.notion.site/3d9aecc3248d4861a98b83bf8ef1959b"
                        target="_blank"
                    >
                        <Button
                            variant="secondary"
                            size="lg"
                            className="flex flex-row items-center gap-2 w-full"
                        >
                            <Icons.book className="h-4 w-4" /> Learn more
                        </Button>
                    </Link>
                </div>
            </section>
            <MainFooter />
        </>
    );
}
