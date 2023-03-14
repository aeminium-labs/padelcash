import Link from "next/link";
import { useRouter } from "next/router";
import { useAtom, useAtomValue } from "jotai";

import { authProviderAtom, web3AuthAtom } from "@/lib/store";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
    children: React.ReactNode;
};

function SidebarLink({
    children,
    href,
    disabled = false,
    ...rest
}: React.ComponentPropsWithoutRef<typeof Link> & { disabled?: boolean }) {
    const router = useRouter();
    const isActive = router.asPath === href;

    const button = (
        <Button
            variant={isActive ? "subtle" : "ghost"}
            size="sm"
            className="w-full justify-start"
            disabled={disabled}
        >
            {children}
        </Button>
    );

    if (disabled) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span tabIndex={0}>{button}</span>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>Soon</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <Link href={href} {...rest}>
            {button}
        </Link>
    );
}

export function LayoutApp({ children }: Props) {
    const web3auth = useAtomValue(web3AuthAtom);
    const [provider, setProvider] = useAtom(authProviderAtom);

    const onLogoutClick = async () => {
        if (web3auth) {
            try {
                await web3auth.logout();
                setProvider(null);
            } catch (e) {
                console.log(e);
            }
        }
    };

    let content = (
        <div className="col-span-4 self-stretch xl:col-span-5">
            <div className="h-full py-6">No access</div>
        </div>
    );

    if (provider) {
        content = (
            <>
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
                            <SidebarLink href="/account/history">
                                <Icons.scroll className="mr-2 h-4 w-4" />
                                History
                            </SidebarLink>
                            <SidebarLink href="/achievements">
                                <Icons.award className="mr-2 h-4 w-4" />
                                Achievements
                            </SidebarLink>
                        </div>
                    </div>
                    <div className="border-b border-b-slate-800 py-4">
                        <div className="flex flex-col gap-1">
                            <SidebarLink href="/transfer" disabled={true}>
                                <Icons.transfer className="mr-2 h-4 w-4" />
                                Payments
                            </SidebarLink>
                            <SidebarLink href="/earn" disabled={true}>
                                <Icons.coins className="mr-2 h-4 w-4" />
                                Investments
                            </SidebarLink>
                        </div>
                    </div>
                    <div className="py-4">
                        <div className="space-y-1">
                            <SidebarLink href="/account/profile">
                                <Icons.user className="mr-2 h-4 w-4" />
                                Profile
                            </SidebarLink>
                            <SidebarLink href="/account/settings">
                                <Icons.settings className="mr-2 h-4 w-4" />
                                Settings
                            </SidebarLink>
                            <SidebarLink href="https://www.google.com">
                                <Icons.help className="mr-2 h-4 w-4" />
                                Documentation
                            </SidebarLink>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                                onClick={onLogoutClick}
                            >
                                <Icons.logout className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </aside>
            </>
        );
    }

    return (
        <section className="container grid grid-cols-4 items-center gap-2 xl:grid-cols-5">
            {content}
        </section>
    );
}
