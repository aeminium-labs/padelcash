"use client";

import React from "react";

import { Icons } from "@/components/icons";
import { NavbarLink } from "@/components/shared/navbar-link";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function AccountLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        address: string;
    };
}) {
    const { address } = params;
    const [open, setOpen] = React.useState(false);

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
    };

    return (
        <>
            {children}
            <footer className="fixed bottom-0 w-full border-t border-t-teal-700 bg-slate-900/90 backdrop-blur-xl">
                <div className="grid grid-cols-5 divide-x">
                    <NavbarLink href={`/account/${address}`}>
                        <Icons.wallet className="h-6 w-6" />
                        Wallet
                    </NavbarLink>
                    <NavbarLink href={`/account/${address}/vault`}>
                        <Icons.vault className="h-6 w-6" />
                        Vault
                    </NavbarLink>
                    <NavbarLink href={`/account/${address}/payments`}>
                        <Icons.coins className="h-6 w-6" />
                        Payments
                    </NavbarLink>
                    <NavbarLink href={`/account/${address}/events`}>
                        <Icons.calendar className="h-6 w-6" />
                        Events
                    </NavbarLink>
                    <Sheet open={open} onOpenChange={handleOpenChange}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex h-auto w-full flex-col rounded-none text-xs"
                            >
                                <Icons.moreHorizontal className="h-6 w-6" />
                                More
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[250px] p-0">
                            <div className="flex h-full grow flex-col justify-end divide-y">
                                <NavbarLink
                                    href={`/account/${address}/badges`}
                                    variant="horizontal"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    <Icons.award className="h-6 w-6" />
                                    Badges
                                </NavbarLink>
                                <NavbarLink
                                    href={`/account/${address}/giftcards`}
                                    variant="horizontal"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    <Icons.gift className="h-6 w-6" />
                                    Gift cards
                                </NavbarLink>
                                <NavbarLink
                                    href={`/account/${address}/settings`}
                                    variant="horizontal"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    <Icons.user className="h-6 w-6" />
                                    Account
                                </NavbarLink>
                                <NavbarLink
                                    href={`/logout`}
                                    variant="horizontal"
                                >
                                    <Icons.logout className="h-6 w-6" />
                                    Logout
                                </NavbarLink>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </footer>
        </>
    );
}
