import { Icons } from "@/components/icons";
import { NavbarLink } from "@/components/shared/navbar-link";

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
            <footer className="fixed bottom-0 w-full border-t border-t-teal-700 bg-slate-900/40 backdrop-blur-xl">
                <div className="grid grid-cols-5 divide-x">
                    <NavbarLink href={`/account/${address}`}>
                        <Icons.wallet className="mb-2 h-6 w-6" />
                        Wallet
                    </NavbarLink>
                    <NavbarLink href={`/account/${address}/vault`}>
                        <Icons.vault className="mb-2 h-6 w-6" />
                        Vault
                    </NavbarLink>
                    <NavbarLink href={`/account/${address}/payments`}>
                        <Icons.coins className="mb-2 h-6 w-6" />
                        Payments
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
