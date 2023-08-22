import { NextRequest, NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";

export type TxConfirmResponse = {
    confirmed: boolean;
    message: string;
};

export async function POST(req: NextRequest) {
    const { txSignature } = await req.json();

    const connection = new Connection(
        `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
    );

    try {
        const latestBlockhash = await connection.getLatestBlockhash(
            "finalized"
        );

        const confirmation = await connection.confirmTransaction({
            signature: txSignature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });

        if (confirmation.value.err) {
            return NextResponse.json<TxConfirmResponse>({
                confirmed: false,
                message: "Transaction not confirmed",
            });
        }

        return NextResponse.json<TxConfirmResponse>({
            confirmed: true,
            message: "Transaction confirmed",
        });
    } catch (e) {
        return NextResponse.json<TxConfirmResponse>({
            confirmed: false,
            message: "Transaction not confirmed",
        });
    }
}
