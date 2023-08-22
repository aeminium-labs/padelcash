"use client";

import { useAtomValue } from "jotai";

import { connectionStatusAtom } from "@/lib/store";
import { Icons } from "@/components/icons";
import { LogoutButton } from "@/components/shared/logout-button";
import { NavbarLink } from "@/components/shared/navbar-link";

type Props = {
    accountAddress: string;
};

export function Sidebar({ accountAddress }: Props) {
    const connectionStatus = useAtomValue(connectionStatusAtom);
    const isConnected = connectionStatus === "connected";

    return (
        <aside className="self-stretch">
            <div className="border-b border-b-slate-800 py-4">
                <div className="flex flex-col gap-1">
                    <NavbarLink
                        href={`/account/${accountAddress}`}
                        disabled={!isConnected}
                    >
                        <Icons.wallet className="mr-2 h-4 w-4" />
                        Accounts
                    </NavbarLink>
                    <NavbarLink
                        href={`/account/${accountAddress}/badges`}
                        disabled={!isConnected}
                    >
                        <Icons.award className="mr-2 h-4 w-4" />
                        Badges
                    </NavbarLink>
                    <NavbarLink
                        href={`/account/${accountAddress}/payments`}
                        disabled={true}
                    >
                        <Icons.transfer className="mr-2 h-4 w-4" />
                        Payments
                    </NavbarLink>
                    <NavbarLink
                        href={`/account/${accountAddress}/investments`}
                        disabled={true}
                    >
                        <Icons.coins className="mr-2 h-4 w-4" />
                        Investments
                    </NavbarLink>
                </div>
            </div>
            <div className="border-b border-b-slate-800 py-4">
                <div className="flex flex-col gap-1">
                    <NavbarLink
                        href={`/account/${accountAddress}/profile`}
                        disabled={true}
                    >
                        <Icons.user className="mr-2 h-4 w-4" />
                        Profile
                    </NavbarLink>
                    <NavbarLink
                        href={`/account/${accountAddress}/profile`}
                        disabled={true}
                    >
                        <Icons.contact className="mr-2 h-4 w-4" />
                        Contacts
                    </NavbarLink>
                    <NavbarLink
                        href={`/account/${accountAddress}/profile`}
                        disabled={true}
                    >
                        <Icons.globe className="mr-2 h-4 w-4" />
                        Clubs
                    </NavbarLink>
                    <NavbarLink
                        href={`/account/${accountAddress}/profile`}
                        disabled={true}
                    >
                        <Icons.calendar className="mr-2 h-4 w-4" />
                        Events
                    </NavbarLink>
                </div>
            </div>
            <div className="py-4">
                <div className="space-y-1">
                    <NavbarLink href="/docs" disabled={true}>
                        <Icons.help className="mr-2 h-4 w-4" />
                        Documentation
                    </NavbarLink>
                    <LogoutButton disabled={!isConnected}>
                        <Icons.logout className="mr-2 h-4 w-4" />
                        Logout
                    </LogoutButton>
                </div>
            </div>
        </aside>
    );
}
