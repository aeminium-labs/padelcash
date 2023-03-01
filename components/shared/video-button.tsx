import React from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type Props = {
    children: React.ReactNode;
};

export function VideoButton({ children }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[780px]">
                <iframe
                    className="aspect-video w-full"
                    src="https://www.youtube-nocookie.com/embed/5m8ncaq6pcM?controls=0"
                    title="Padelcash Promo"
                    allowFullScreen
                ></iframe>
            </DialogContent>
        </Dialog>
    );
}
