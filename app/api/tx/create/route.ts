import { NextRequest, NextResponse } from "next/server";
import {
    createAssociatedTokenAccountInstruction,
    createTransferCheckedInstruction,
} from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

import { PADEL_TOKEN } from "@/lib/constants";
import { getPadelAta, getTokenInfo } from "@/lib/fetchers";
import { getBaseUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
    const baseUrl = getBaseUrl();
    const { senderAddress, receiverAddress, amount } = await request.json();

    const connection = new Connection(`${baseUrl}/api/rpc`);

    let transaction = new Transaction();

    // Fetch sender ATA
    const senderAta = await getPadelAta(senderAddress);

    // Fetch receiver ATA
    const receiverAta = await getPadelAta(receiverAddress);

    // Fetches token info
    const tokenInfo = await getTokenInfo(PADEL_TOKEN);

    // TODO: replace this with relayer
    const payer = new PublicKey(senderAddress);

    // Create ATA on behalf of receiver
    if (!receiverAta.created) {
        transaction.add(
            createAssociatedTokenAccountInstruction(
                payer,
                new PublicKey(receiverAta.ata),
                new PublicKey(receiverAddress),
                new PublicKey(tokenInfo.mint)
            )
        );
    }

    // Create transaction instruction
    transaction.add(
        createTransferCheckedInstruction(
            new PublicKey(senderAta.ata), // from
            new PublicKey(tokenInfo.mint), // mint
            new PublicKey(receiverAta.ata), // to
            payer, // from's owner
            amount * 10 ** tokenInfo.decimals, // amount
            tokenInfo.decimals // decimals
        )
    );

    const blockHash = (await connection.getLatestBlockhash("finalized"))
        .blockhash;

    transaction.feePayer = payer;
    transaction.recentBlockhash = blockHash;

    const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: true,
    });

    const transactionBase64 = serializedTransaction.toString("base64");

    return NextResponse.json({ tx: transactionBase64 });
}
