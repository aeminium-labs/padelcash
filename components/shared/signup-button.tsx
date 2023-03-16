"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import galan from "@/public/galan.gif";
import Confetti from "react-confetti";
import { SubmitHandler, useForm } from "react-hook-form";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
    children: React.ReactNode;
    onSubmitSuccess?: Function;
};

type Inputs = {
    email: string;
};

export function SignupButton({ children, onSubmitSuccess }: Props) {
    const { register, handleSubmit, setError, reset, formState } =
        useForm<Inputs>();
    const [confetti, setConfetti] = React.useState(true);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const JSONdata = JSON.stringify(data);
        const endpoint = "/api/signup";

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSONdata,
        };

        const res = await fetch(endpoint, options);

        if (res.status === 201) {
            if (onSubmitSuccess) {
                onSubmitSuccess();
            }
        } else if (res.status === 409) {
            setError("root.serverError", {
                type: res.status.toString(),
                message: "Looks like you've registered already with this email",
            });
        } else {
            setError("root.serverError", {
                type: res.status.toString(),
                message: "Unable to register, please try again.",
            });
        }
    };

    return (
        <Dialog
            onOpenChange={(open) => {
                if (open) {
                    if (formState.isSubmitSuccessful) {
                        reset();
                    }
                    setConfetti(true);
                } else {
                    setConfetti(false);
                }
            }}
        >
            {formState.isSubmitSuccessful && <Confetti recycle={confetti} />}
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {formState.isSubmitSuccessful ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex flex-row items-center gap-2">
                                <Icons.checkCircle className="h-5 w-5" /> All
                                done!
                            </DialogTitle>
                            <Image
                                src={galan}
                                alt="Ale Galan"
                                className="w-full py-2"
                            />
                            <DialogDescription>
                                Thanks for registering your interest in{" "}
                                <span className="font-bold text-teal-500">
                                    Padelcash
                                </span>
                                .
                            </DialogDescription>
                            <DialogDescription>
                                We&apos;re working very hard to create a new
                                padel economy for millions of players and
                                coaches and you&apos;ll be one of the first ones
                                to experience it!
                            </DialogDescription>
                            <DialogDescription>
                                Soon you&apos;ll receive an email from us with
                                everything you need to setup your new{" "}
                                <span className="font-bold text-teal-500">
                                    Padelcash
                                </span>{" "}
                                account, but in the meantime make sure to{" "}
                                <Link
                                    href={siteConfig.links.twitter}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium underline underline-offset-4"
                                >
                                    follow us on Twitter
                                </Link>
                                !
                            </DialogDescription>
                        </DialogHeader>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>
                                Be one of the first $PADEL holders
                            </DialogTitle>
                            <DialogDescription>
                                We&apos;re currently invite-only during our beta
                                period, but make sure to register now as
                                we&apos;ll be distributing $PADEL to early
                                adopters!
                            </DialogDescription>
                        </DialogHeader>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            id="signup-form"
                        >
                            <div className="grid gap-4 py-2">
                                <div className="grid grid-rows-2 items-center gap-0">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        autoComplete="off"
                                        {...register("email", {
                                            required: true,
                                        })}
                                        disabled={formState.isSubmitting}
                                    />
                                    {formState.errors?.root?.serverError
                                        .message && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {
                                                formState.errors.root
                                                    .serverError.message
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </form>
                        <DialogFooter>
                            <Button
                                type="submit"
                                form="signup-form"
                                disabled={formState.isSubmitting}
                            >
                                Let&apos;s go!
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
