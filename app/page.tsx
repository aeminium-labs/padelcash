"use client";

import QRCode from "react-qr-code";

import { getAppUrl } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { MainFooter } from "@/components/main-footer";
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

export default function IndexPage() {
    const appUrl = getAppUrl();

    return (
        <>
            <Container className="gap-10">
                <div className="flex flex-col items-start gap-2">
                    <h1 className="max-w-[1000px] text-4xl font-extrabold leading-tight lg:text-6xl lg:leading-snug">
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
                <div className="flex gap-4 pb-4 md:flex-row">
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
                                    value={`${appUrl}/?pswutlzoq=install`}
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
