import { NextRequest, NextResponse } from "next/server";
import { PublicKey, Transaction } from "@solana/web3.js";

import { FEE_PAYER_ADDRESS } from "@/lib/constants";
import { fetcher } from "@/lib/fetchers";

export type JupiterSwapInstructionResponse = {
    swapTransaction: string;
    lastValidBlockHeight: number;
};

export type GetSwapResponse = JupiterSwapInstructionResponse;

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { quote, address } = body;

    if (quote && address) {
        try {
            const swapTx = await fetcher<JupiterSwapInstructionResponse>(
                `https://quote-api.jup.ag/v6/swap`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        quoteResponse: quote,
                        userPublicKey: address,
                        wrapUnwrapSOL: true,
                        asLegacyTransaction: true,
                    }),
                }
            );

            const tx = Transaction.from(
                Buffer.from(swapTx.swapTransaction, "base64")
            );

            tx.feePayer = new PublicKey(FEE_PAYER_ADDRESS);

            const serializedTransaction = tx.serialize({
                requireAllSignatures: false,
            });

            return NextResponse.json<GetSwapResponse>({
                swapTransaction: serializedTransaction.toString("base64"),
                lastValidBlockHeight: swapTx.lastValidBlockHeight,
            });
        } catch (e) {
            console.log(e);
        }
    }

    return NextResponse.json({}, { status: 500 });
}
