import { NextRequest, NextResponse } from "next/server";

import { PADEL_TOKEN } from "@/lib/constants";
import { fetcher } from "@/lib/fetchers";

export type JupiterPriceResponse = {
    data: Record<
        string,
        {
            id: string;
            mintSymbol: string;
            vsToken: string;
            vsTokenSymbol: string;
            price: number;
        }
    >;
    timeTaken: number;
};

export type GetPriceResponse = {
    value: number;
};

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { amount = 1, token = PADEL_TOKEN } = body;

    try {
        const tokenPrice = await fetcher<JupiterPriceResponse>(
            `https://price.jup.ag/v4/price?ids=${token}`
        );

        const value = tokenPrice.data[token].price * amount;

        return NextResponse.json({ value });
    } catch (e) {}

    return NextResponse.json({
        value: 0,
    });
}
