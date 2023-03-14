import { LogoutButton } from "@/app/account/logout-button";

import { Icons } from "@/components/icons";
import { SidebarLink } from "@/components/shared/sidebar-link";

export default function AccountLayout({ children }) {
    return (
        <section className="container grid grid-cols-4 items-center gap-2 xl:grid-cols-5">
            <div className="col-span-3 self-stretch border-r border-r-slate-700 xl:col-span-4">
                <div className="h-full py-6">{children}</div>
            </div>
            <aside className="self-stretch">
                <div className="border-b border-b-slate-800 py-4">
                    <div className="flex flex-col gap-1">
                        <SidebarLink href="/account/overview">
                            <Icons.wallet className="mr-2 h-4 w-4" />
                            Accounts
                        </SidebarLink>
                        <SidebarLink href="/account/profile">
                            <Icons.user className="mr-2 h-4 w-4" />
                            Profile
                        </SidebarLink>
                        <SidebarLink href="/account/badges">
                            <Icons.award className="mr-2 h-4 w-4" />
                            Badges
                        </SidebarLink>
                    </div>
                </div>
                <div className="border-b border-b-slate-800 py-4">
                    <div className="flex flex-col gap-1">
                        <SidebarLink href="/account/payments" disabled={true}>
                            <Icons.transfer className="mr-2 h-4 w-4" />
                            Payments
                        </SidebarLink>
                        <SidebarLink
                            href="/account/investments"
                            disabled={true}
                        >
                            <Icons.coins className="mr-2 h-4 w-4" />
                            Investments
                        </SidebarLink>
                    </div>
                </div>
                <div className="py-4">
                    <div className="space-y-1">
                        <SidebarLink href="/account/settings">
                            <Icons.settings className="mr-2 h-4 w-4" />
                            Settings
                        </SidebarLink>
                        <SidebarLink href="https://www.google.com">
                            <Icons.help className="mr-2 h-4 w-4" />
                            Documentation
                        </SidebarLink>
                        <LogoutButton>
                            <Icons.logout className="mr-2 h-4 w-4" />
                            Logout
                        </LogoutButton>
                    </div>
                </div>
            </aside>
        </section>
    );
}
