import React, { Suspense } from "react";
import Link from "next/link";

import { getBalances } from "@/lib/fetchers";
import { Icons } from "@/components/icons";
import { PadelBalance } from "@/components/padelBalance";
import { NavbarLink } from "@/components/shared/navbar-link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

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

    return (
        <>
            {children}
            <footer className="fixed inset-x-0 bottom-0 overflow-hidden border-t border-teal-700 bg-slate-900/50 backdrop-blur-xl">
                <div className="container flex h-16 items-center justify-start gap-3 px-4">
                    <div className="flex items-center justify-start">
                        <nav className="flex items-center space-x-2">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        className="px-3"
                                    >
                                        <Icons.user className="h-4 w-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="w-[250px] p-0"
                                    hideCloseButton={true}
                                >
                                    <div className="flex h-full grow flex-col justify-end divide-y">
                                        <NavbarLink
                                            href={`/account/${address}/setting`}
                                            variant="horizontal"
                                        >
                                            <Icons.user className="h-4 w-4" />
                                            Account
                                        </NavbarLink>
                                        <NavbarLink
                                            href={`/account/logout`}
                                            variant="horizontal"
                                        >
                                            <Icons.logout className="h-4 w-4" />
                                            Logout
                                        </NavbarLink>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </nav>
                    </div>
                    <Suspense fallback={<Skeleton className="h-8 w-full" />}>
                        <PadelBalance data={getBalances(address)} />
                    </Suspense>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="secondary" className="px-3">
                                Menu
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-[250px] p-0"
                            hideCloseButton={true}
                        >
                            <div className="flex h-full grow flex-col">
                                <SheetHeader className="py-4">
                                    <SheetTitle className="flex items-center justify-center gap-2">
                                        <Icons.logo className="h-8 w-8" />{" "}
                                        Padelcash
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex h-full grow flex-col justify-end divide-y">
                                    <NavbarLink
                                        href={`/account/${address}`}
                                        variant="horizontal"
                                    >
                                        <Icons.wallet className="h-4 w-4" />
                                        Wallet
                                    </NavbarLink>
                                    <NavbarLink
                                        href={`/account/${address}/vault`}
                                        variant="horizontal"
                                    >
                                        <Icons.vault className="h-4 w-4" />
                                        Vault
                                    </NavbarLink>
                                    <NavbarLink
                                        href={`/account/${address}/payments`}
                                        variant="horizontal"
                                    >
                                        <Icons.coins className="h-4 w-4" />
                                        Payments
                                    </NavbarLink>
                                    <NavbarLink
                                        href={`/account/${address}/badges`}
                                        variant="horizontal"
                                    >
                                        <Icons.award className="h-4 w-4" />
                                        Badges
                                    </NavbarLink>
                                    <NavbarLink
                                        href={`/account/${address}/events`}
                                        variant="horizontal"
                                    >
                                        <Icons.calendar className="h-4 w-4" />
                                        Events
                                    </NavbarLink>
                                    <NavbarLink
                                        href={`/account/${address}/giftcards`}
                                        variant="horizontal"
                                    >
                                        <Icons.gift className="h-4 w-4" />
                                        Gift cards
                                    </NavbarLink>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </footer>
        </>
    );
}
