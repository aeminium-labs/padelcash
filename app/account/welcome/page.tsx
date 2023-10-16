"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { useForm } from "react-hook-form";

import { createBadge } from "@/lib/fetchers";
import { userAtom } from "@/lib/store";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Inputs = {
    name: string;
};

export default function WelcomePage() {
    const { register, getValues, handleSubmit, watch, formState } =
        useForm<Inputs>();
    const user = useAtomValue(userAtom);
    const router = useRouter();

    const hasName = (watch("name") || "").length > 0;

    const onSubmit = async () => {
        const name = getValues("name");

        if (user && user.publicAddress) {
            const badgeResponse = await createBadge(
                user.publicAddress,
                "registration",
                [{ trait_type: "name", value: name }]
            );

            if (window.progressier) {
                window.progressier.add({
                    tags: "registered",
                    wallet: user.publicAddress,
                });
            }

            if (badgeResponse.status !== "error") {
                router.push(`/account/${user.publicAddress}`);
            }
        }
    };

    return (
        <Container>
            <div className="flex flex-col gap-10">
                <Image
                    src="/welcome-illustration.png"
                    alt="Illustration of a man with sport clothing"
                    width={300}
                    height={300}
                    className="aspect-square self-center object-cover"
                    priority
                />
                <div className="flex flex-col items-start gap-4">
                    <h1 className="max-w-[1280px] text-4xl font-extrabold leading-tight">
                        Welcome to Padelcash!
                    </h1>

                    <p className="text-xl text-slate-400">
                        We're building a new economy for the padel ecosystem,
                        where you can pay, earn and grow your rewards just for
                        playing the sport that you love!
                    </p>

                    <p className="text-xl text-slate-400">
                        Let's get you started right away 👇
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="name"
                            className="text-lg font-bold leading-tight"
                        >
                            How should we call you?
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            autoComplete="off"
                            className="h-12"
                            {...register("name", {
                                required: true,
                            })}
                        />
                    </div>
                    <footer className="container fixed bottom-0 left-0 w-full border-t border-t-slate-700 bg-slate-900/90 p-4 backdrop-blur-xl md:hidden">
                        <div className="flex flex-col items-center justify-start gap-4 md:flex-row ">
                            <Button
                                variant="success"
                                size="lg"
                                disabled={
                                    !hasName ||
                                    formState.isSubmitting ||
                                    formState.isSubmitSuccessful
                                }
                                type="submit"
                                className="w-full px-4"
                            >
                                Finish setup
                            </Button>
                        </div>
                    </footer>
                </form>
            </div>
        </Container>
    );
}
