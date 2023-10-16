"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Icons } from "@/components/icons";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    const router = useRouter();
    return (
        <Container>
            <div className="flex flex-col items-start gap-2">
                <h1 className="max-w-[1280px] text-4xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl lg:leading-snug">
                    Ooopsie!
                </h1>
                <p className="text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
                    This page isn't ready yet, sorry about that!
                </p>
            </div>
            <Link href="/">
                <Button
                    variant="default"
                    size="lg"
                    className="mt-8 flex w-full flex-row items-center gap-2"
                    onClick={() => {
                        router.back();
                    }}
                >
                    <Icons.undo className="h-4 w-4" /> Go back
                </Button>
            </Link>
        </Container>
    );
}
