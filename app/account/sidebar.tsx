"use client";

import { useAtomValue } from "jotai";

import { authProviderAtom } from "@/lib/store";
import { Icons } from "@/components/icons";
import { LogoutButton } from "@/components/shared/logout-button";
import { SidebarLink } from "@/components/shared/sidebar-link";

type Props = {
    accountAddress: string;
};

export function Sidebar({ accountAddress }: Props) {
    const provider = useAtomValue(authProviderAtom);

    const isDisabled = !provider;

    return (
        <aside className="self-stretch">
            <div className="border-b border-b-slate-800 py-4">
                <div className="flex flex-col gap-1">
                    <SidebarLink
                        href={`/account/${accountAddress}`}
                        disabled={isDisabled}
                    >
                        <Icons.wallet className="mr-2 h-4 w-4" />
                        Accounts
                    </SidebarLink>
                    <SidebarLink
                        href={`/account/${accountAddress}/badges`}
                        disabled={isDisabled}
                    >
                        <Icons.award className="mr-2 h-4 w-4" />
                        Badges
                    </SidebarLink>
                    <SidebarLink
                        href={`/account/${accountAddress}/payments`}
                        disabled={true}
                    >
                        <Icons.transfer className="mr-2 h-4 w-4" />
                        Payments
                    </SidebarLink>
                    <SidebarLink
                        href={`/account/${accountAddress}/investments`}
                        disabled={true}
                    >
                        <Icons.coins className="mr-2 h-4 w-4" />
                        Investments
                    </SidebarLink>
                </div>
            </div>
            <div className="border-b border-b-slate-800 py-4">
                <div className="flex flex-col gap-1">
                    <SidebarLink
                        href={`/account/${accountAddress}/profile`}
                        disabled={true}
                    >
                        <Icons.user className="mr-2 h-4 w-4" />
                        Profile
                    </SidebarLink>
                    <SidebarLink
                        href={`/account/${accountAddress}/profile`}
                        disabled={true}
                    >
                        <Icons.contact className="mr-2 h-4 w-4" />
                        Contacts
                    </SidebarLink>
                    <SidebarLink
                        href={`/account/${accountAddress}/profile`}
                        disabled={true}
                    >
                        <Icons.globe className="mr-2 h-4 w-4" />
                        Clubs
                    </SidebarLink>
                    <SidebarLink
                        href={`/account/${accountAddress}/profile`}
                        disabled={true}
                    >
                        <Icons.calendar className="mr-2 h-4 w-4" />
                        Events
                    </SidebarLink>
                </div>
            </div>
            <div className="py-4">
                <div className="space-y-1">
                    <SidebarLink href="/docs" disabled={true}>
                        <Icons.help className="mr-2 h-4 w-4" />
                        Documentation
                    </SidebarLink>
                    <LogoutButton disabled={isDisabled}>
                        <Icons.logout className="mr-2 h-4 w-4" />
                        Logout
                    </LogoutButton>
                </div>
            </div>
        </aside>
    );
}
