import { NextRequest, NextResponse } from "next/server";
import { Connection, Keypair, Transaction } from "@solana/web3.js";
import bs58 from "bs58";

import { getBaseUrl } from "@/lib/server/utils";

export type TxSignResponse = {
    signedTx: string;
};

export async function POST(req: NextRequest) {
    const { signedTx } = await req.json();
    const baseUrl = getBaseUrl();

    try {
        if (process.env.RELAYER_WALLET_PK) {
            const connection = new Connection(`${baseUrl}/api/rpc`);
            const feePayer = Keypair.fromSecretKey(
                bs58.decode(process.env.RELAYER_WALLET_PK)
            );

            const recoveredTransaction = Transaction.from(
                Buffer.from(signedTx, "base64")
            );

            recoveredTransaction.partialSign(feePayer);

            const txnSignature = await connection.sendRawTransaction(
                recoveredTransaction.serialize()
            );

            if (txnSignature) {
                return NextResponse.json<TxSignResponse>({
                    signedTx: txnSignature,
                });
            }
        }
    } catch (e) {
        throw new Error(e);
    }

    return NextResponse.json({}, { status: 500 });
}
