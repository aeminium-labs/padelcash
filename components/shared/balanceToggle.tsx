"use client";

import React from "react";

type Props = {
    usdBalance?: string;
    padelBalance?: string;
};

export function BalanceToggle({ usdBalance = "", padelBalance = "" }: Props) {
    const [showPadel, setShowPadel] = React.useState(false);

    let value = `$${usdBalance}`;
    let label = "USD";

    if (showPadel) {
        value = padelBalance;
        label = "PADEL";
    }

    return (
        <div
            className="cursor-pointer text-3xl font-bold"
            onClick={() => {
                setShowPadel((showPadel) => !showPadel);
            }}
        >
            {value} <span className="text-sm text-slate-700">{label}</span>
        </div>
    );
}
