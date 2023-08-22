import { NextRequest, NextResponse } from "next/server";

import { fetcher } from "@/lib/fetchers";
import { getTokenInfo } from "@/lib/server/fetchers";

export type JupiterSwapQuoteResponse = {
    inputMint: string;
    inAmount: string;
    outputMint: string;
    outAmount: string;
    otherAmountThreshold: string;
    swapMode: string;
    slippageBps: number;
    platformFee: null;
    priceImpactPct: string;
    routePlan: RoutePlan[];
    contextSlot: number;
    timeTaken: number;
};

type RoutePlan = {
    swapInfo: SwapInfo;
    percent: number;
};

type SwapInfo = {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
};

export type GetQuoteResponse = {
    value: number;
    minimumValue: number;
    priceImpact: number;
    quote: JupiterSwapQuoteResponse;
};

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { amount, fromToken, toToken } = body;

    if (amount && fromToken && toToken) {
        try {
            // Convert amount to include decimals
            const fromTokenInfo = await getTokenInfo(fromToken);
            const amountWithDecimals = amount * 10 ** fromTokenInfo.decimals;

            const roundedAmount =
                Math.round((amountWithDecimals + Number.EPSILON) * 10000) /
                10000;

            const swapQuote = await fetcher<JupiterSwapQuoteResponse>(
                `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken}&outputMint=${toToken}&amount=${roundedAmount}&slippageBps=50&asLegacyTransaction=true&onlyDirectRoutes=true`
            );

            const toTokenInfo = await getTokenInfo(toToken);

            // Convert response
            const res: GetQuoteResponse = {
                value:
                    parseInt(swapQuote.outAmount) / 10 ** toTokenInfo.decimals,
                minimumValue:
                    parseInt(swapQuote.otherAmountThreshold) /
                    10 ** toTokenInfo.decimals,
                priceImpact: parseFloat(swapQuote.priceImpactPct) * 100,
                quote: swapQuote,
            };

            return NextResponse.json<GetQuoteResponse>(res);
        } catch (e) {
            console.log(e);
        }
    }

    return NextResponse.json({}, { status: 500 });
}
