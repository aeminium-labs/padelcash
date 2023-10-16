"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";

import { createBadge } from "@/lib/fetchers";
import { userAtom } from "@/lib/store";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
    const user = useAtomValue(userAtom);
    const router = useRouter();

    const handleClick = async () => {
        if (user && user.publicAddress) {
            const badgeResponse = await createBadge(
                user.publicAddress,
                "registration"
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
            <div className="flex grow flex-col justify-end gap-10">
                <Image
                    src="/welcome-illustration.png"
                    alt="Illustration of a man with sport clothing"
                    width={300}
                    height={300}
                    className="aspect-square self-center object-cover"
                    priority
                />
                <div className="mb-8 flex flex-col items-start gap-4">
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

                <footer className="container fixed bottom-0 left-0 w-full border-t border-t-slate-700 bg-slate-900/90 p-4 backdrop-blur-xl md:hidden">
                    <div className="flex flex-col items-center justify-start gap-4 md:flex-row ">
                        <Button
                            variant="success"
                            size="lg"
                            onClick={handleClick}
                            className="w-full "
                        >
                            Finish setup
                        </Button>
                    </div>
                </footer>
            </div>
        </Container>
    );
}
