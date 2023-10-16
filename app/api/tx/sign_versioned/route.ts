import { NextRequest, NextResponse } from "next/server";
import {
    Connection,
    Keypair,
    Transaction,
    VersionedTransaction,
} from "@solana/web3.js";
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

            const recoveredTransaction = VersionedTransaction.deserialize(
                Buffer.from(signedTx, "base64")
            );

            recoveredTransaction.sign([feePayer]);

            const txnSignature = await connection.sendRawTransaction(
                recoveredTransaction.serialize(),
                {
                    skipPreflight: true,
                    maxRetries: 2,
                }
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
