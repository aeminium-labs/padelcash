import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function trimWalletAddress(address: string, chars: number = 5) {
    if (address.length <= chars * 2) {
        return address;
    }

    const firstChars = address.slice(0, chars);
    const lastChars = address.slice(-chars);

    return `${firstChars}...${lastChars}`;
}

export function formatValue(value: number = 0, decimals: number = 0) {
    const res = value / 10 ** decimals;
    return Math.round((res + Number.EPSILON) * 10000) / 10000;
}

export function formatDate(
    value: string,
    variant: "short" | "long" = "short"
): string {
    const date = new Date(value);

    const variants: Record<"short" | "long", Intl.DateTimeFormatOptions> = {
        short: {
            day: "numeric",
            month: "short",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        },
        long: {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            weekday: "short",
        },
    };

    return date.toLocaleString("en-gb", variants[variant]);
}
