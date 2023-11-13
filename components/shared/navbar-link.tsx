"use client";

import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const navlinkVariants = cva([], {
    variants: {
        variant: {
            horizontal: "flex-row py-5 w-full justify-start",
            vertical: "flex-col",
        },
    },
    defaultVariants: {
        variant: "vertical",
    },
});

type NavbarLinkProps = Omit<
    React.ComponentPropsWithoutRef<typeof Link>,
    "href"
> & {
    disabled?: boolean;
    href?: Url;
} & VariantProps<typeof navlinkVariants>;

export function NavbarLink({
    children,
    href,
    disabled = false,
    variant,
    className,
    ...rest
}: NavbarLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    const button = (
        <Button
            variant={isActive ? "success" : "ghost"}
            className={cn(
                navlinkVariants({ variant }),
                "flex h-auto w-full gap-2 rounded-none py-4 text-xs",
                className
            )}
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
