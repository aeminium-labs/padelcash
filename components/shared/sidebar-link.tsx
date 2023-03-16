"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function SidebarLink({
    children,
    href,
    disabled = false,
    ...rest
}: React.ComponentPropsWithoutRef<typeof Link> & { disabled?: boolean }) {
    const pathname = usePathname();
    const isActive = pathname === href;

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
