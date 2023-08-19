"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import QRCode from "react-qr-code";

import { getBaseUrl } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const MainFooter = dynamic(
    () => import("@/components/main-footer").then((mod) => mod.MainFooter),
    { ssr: false }
);

export default function IndexPage() {
    const baseUrl = getBaseUrl();
    return (
        <>
            <Container className="gap-10">
                <div className="flex flex-col items-start gap-2">
                    <h1 className="max-w-[1000px] text-5xl font-extrabold leading-tight lg:text-6xl lg:leading-snug">
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
                <div className="flex gap-4 pt-4 md:flex-row">
                    <Link
                        href="https://bristle-citron-418.notion.site/3d9aecc3248d4861a98b83bf8ef1959b"
                        target="_blank"
                    >
                        <Button
                            variant="secondary"
                            size="lg"
                            className="flex w-full flex-row items-center gap-2"
                        >
                            <Icons.book className="h-4 w-4" /> Learn more
                        </Button>
                    </Link>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="lg"
                                className="hidden flex-row items-center gap-2 md:flex"
                            >
                                <Icons.phone className="h-4 w-4" /> Install on
                                your phone
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Please scan the QR code with your phone
                                </DialogTitle>
                                <DialogDescription></DialogDescription>
                            </DialogHeader>
                            <div className="rounded-xl bg-primary py-12">
                                <QRCode
                                    value={`${baseUrl}/?pswutlzoq=install`}
                                    className="w-full"
                                    size={300}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </Container>
            <MainFooter />
        </>
    );
}
