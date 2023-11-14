"use client";

import React from "react";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { NavbarLink } from "@/components/shared/navbar-link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
            <footer className="fixed inset-x-4 bottom-4 overflow-hidden rounded-lg border border-teal-700 bg-slate-900/50 backdrop-blur-xl">
                <div className="grid grid-cols-5 divide-x">
                    <NavbarLink href={`/account/${address}`}>Wallet</NavbarLink>
                    <NavbarLink href={`/account/${address}/vault`}>
                        Vault
                    </NavbarLink>
                    <NavbarLink href={`/account/${address}/payments`}>
                        Payments
                    </NavbarLink>
                    <NavbarLink href={`/account/${address}/events`}>
                        Events
                    </NavbarLink>
                    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex h-auto w-full flex-col rounded-none text-xs"
                            >
                                <Icons.moreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link href={`/account/${address}/badges`}>
                                        Badges
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/account/${address}/giftcards`}
                                    >
                                        Gift cards
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </footer>
        </>
    );
}
