import { NextRequest, NextResponse } from "next/server";
import { Connection, Transaction } from "@solana/web3.js";

import { getBaseUrl } from "@/lib/server/utils";

export type TxSendResponse = {
    txSignature: string;
};

export async function POST(req: NextRequest) {
    const { signedTx } = await req.json();

    const baseUrl = getBaseUrl();
    const connection = new Connection(`${baseUrl}/api/rpc`);

    const tx = Transaction.from(Buffer.from(signedTx, "base64"));

    const txSignature = await connection.sendRawTransaction(tx.serialize());

    return NextResponse.json<TxSendResponse>({ txSignature });
}
