import { AccountBalances } from "@/app/account/[address]/page";

import { PADEL_TOKEN } from "@/lib/constants";
import { formatAdjustedValue, formatValue } from "@/lib/utils";
import { BalanceToggle } from "@/components/shared/balanceToggle";

type Props = {
    data: Promise<AccountBalances>;
    label?: string;
    variant?: "default" | "small";
};

export async function PadelBalance({ data }: Props) {
    const { account } = await data;

    const padelToken = account.balances.tokens.find(
        (token) => token.mint === PADEL_TOKEN
    );

    const padelBalance = {
        native: formatAdjustedValue(padelToken?.amount, padelToken?.decimals),
        usd: formatValue(padelToken?.amountUSD),
    };

    return (
        <div className="flex flex-1 flex-row items-baseline justify-start">
            <BalanceToggle
                usdBalance={padelBalance.usd.toString()}
                padelBalance={padelBalance.native.toString()}
            />
        </div>
    );
}
