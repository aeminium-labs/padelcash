import Link from "next/link";

import { Icons } from "@/components/icons";
import { NavbarLink } from "@/components/shared/navbar-link";
import { Button } from "@/components/ui/button";

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
            <footer className="w-full fixed bottom-0 border-t bg-slate-900 border-t-teal-700">
                <div className="grid grid-cols-5 divide-x">
                    <NavbarLink href={`/account/${address}`}>
                        <Icons.wallet className="mb-2 h-6 w-6" />
                        Wallet
                    </NavbarLink>
                    <NavbarLink href={`/account/${address}/vault`}>
                        <Icons.vault className="mb-2 h-6 w-6" />
                        Vault
                    </NavbarLink>
                    <NavbarLink href={`/account/${address}/pay`}>
                        <Icons.coins className="mb-2 h-6 w-6" />
                        Pay
                    </NavbarLink>
                    <NavbarLink href={`/account/${address}/badges`}>
                        <Icons.award className="mb-2 h-6 w-6" />
                        Badges
                    </NavbarLink>
                    <NavbarLink>
                        <Icons.moreHorizontal className="mb-2 h-6 w-6" />
                        More
                    </NavbarLink>
                </div>
            </footer>
        </>
    );
}
