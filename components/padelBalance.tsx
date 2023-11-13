import { AccountBalances } from "@/app/account/[address]/page";

import { PADEL_TOKEN } from "@/lib/constants";
import { formatAdjustedValue, formatValue } from "@/lib/utils";

type Props = {
    data: Promise<AccountBalances>;
    label?: string;
    variant?: "default" | "small";
};

export async function PadelBalance({
    data,
    label = "Available balance",
    variant = "default",
}: Props) {
    const { account } = await data;

    const padelToken = account.balances.tokens.find(
        (token) => token.mint === PADEL_TOKEN
    );

    const padelBalance = {
        native: formatAdjustedValue(padelToken?.amount, padelToken?.decimals),
        usd: formatValue(padelToken?.amountUSD),
    };

    if (variant === "small") {
        return (
            <>
                <div className="text-sm font-medium text-teal-500">{label}</div>
                <div className="p-6 pl-2">
                    <div className="text-lg font-bold">
                        {padelBalance.native.toString()}{" "}
                        <span className="text-sm text-muted">PADEL</span>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="flex flex-row items-baseline gap-8">
            <div className="mb-1 text-2xl font-bold">
                ${padelBalance.usd?.toString()}{" "}
                <span className="text-sm text-muted-foreground">USD</span>
            </div>
            <div className="text-md mb-1 opacity-80">
                {padelBalance.native?.toString()}{" "}
                <span className="text-xs text-muted-foreground">PADEL</span>
            </div>
        </div>
    );
}
