import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { TOKEN_MULTIPLIER } from "@/lib/constants";

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

// ATTENTION we only do this adjustment during pilot because we're using BONK
export function formatAdjustedValue(value: number = 0, decimals: number = 0) {
    // 1 PADEL = 500.000 BONK
    const adjustedValue = value / TOKEN_MULTIPLIER;

    return formatValue(adjustedValue, decimals);
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

export function getAppUrl() {
    const vc = process.env.VERCEL_URL;

    if (vc) {
        return `https://${vc}`;
    }

    return "http://localhost:3000";
}
