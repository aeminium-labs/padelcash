"use client";

import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function NavbarLink({
    children,
    href,
    disabled = false,
    ...rest
}: Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> & {
    disabled?: boolean;
    href?: Url;
}) {
    const pathname = usePathname();
    const isActive = pathname === href;

    const button = (
        <Button
            variant={isActive ? "default" : "ghost"}
            className="w-full flex flex-col h-auto text-xs rounded-none"
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
                    <TooltipContent side="top">
                        <p>Soon</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    if (href) {
        return (
            <Link href={href} {...rest}>
                {button}
            </Link>
        );
    }

    return button;
}
