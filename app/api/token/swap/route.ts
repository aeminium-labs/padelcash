import { NextRequest, NextResponse } from "next/server";
import { createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

import { FEE_PAYER_ADDRESS, USDC_TOKEN } from "@/lib/constants";
import { fetcher } from "@/lib/fetchers";
import { getTokenInfo, getUsdcAta } from "@/lib/server/fetchers";
import { getBaseUrl } from "@/lib/server/utils";

export type JupiterSwapInstructionResponse = {
    swapTransaction: string;
    lastValidBlockHeight: number;
};

export type GetSwapResponse = JupiterSwapInstructionResponse;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const baseUrl = getBaseUrl();

    const { quote, address } = body;

    const connection = new Connection(`${baseUrl}/api/rpc`);
    const payer = new PublicKey(FEE_PAYER_ADDRESS);

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

            // Fetch receiver ATA
            const receiverAta = await getUsdcAta(address);

            // Fetches token info
            const tokenInfo = await getTokenInfo(USDC_TOKEN);

            const blockHash = (await connection.getLatestBlockhash("finalized"))
                .blockhash;

            const tx = new Transaction();

            // Create ATA on behalf of receiver
            if (!receiverAta.created) {
                tx.add(
                    createAssociatedTokenAccountInstruction(
                        payer,
                        new PublicKey(receiverAta.ata),
                        new PublicKey(address),
                        new PublicKey(tokenInfo.mint)
                    )
                );
            }

            const recoveredTx = Transaction.from(
                Buffer.from(swapTx.swapTransaction, "base64")
            );

            tx.add(...recoveredTx.instructions);

            tx.feePayer = new PublicKey(FEE_PAYER_ADDRESS);
            tx.recentBlockhash = blockHash;

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
