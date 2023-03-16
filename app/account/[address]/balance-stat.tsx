"use client";

import { typographyVariants } from "@/components/ui/typography";

type Props = {
    nativeValue: string;
    usdValue?: string;
    label: string;
};

export function BalanceStat({
    nativeValue = "-",
    usdValue = "-",
    label,
}: Props) {
    return (
        <div className="flex items-center justify-between rounded-md bg-slate-200 p-4 text-slate-700 shadow-lg">
            <h2
                className={typographyVariants({ variant: "h3", style: "bold" })}
            >
                {nativeValue}{" "}
                <span className="text-lg text-gray-600">{label}</span>
            </h2>
            <p className="text-sm text-gray-500">${usdValue} USDC</p>
        </div>
    );
}
