import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function trimWalletAddress(address: string) {
    const firstChars = address.slice(0, 5);
    const lastChars = address.slice(-5);

    return `${firstChars}...${lastChars}`;
}

export function formatValue(value: number = 0, decimals: number = 0) {
    const res = value / 10 ** decimals;
    return Math.round((res + Number.EPSILON) * 10000) / 10000;
}
