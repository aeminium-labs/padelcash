import { NextRequest, NextResponse } from "next/server";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import { PADEL_TOKEN } from "@/lib/constants";

type Data = { message: String };

export async function GET(
    _: NextRequest,
    { params }: { params: { address: string } }
) {
    try {
        const ata = await getAssociatedTokenAddress(
            new PublicKey(PADEL_TOKEN),
            new PublicKey(params.address),
            false
        );

        return NextResponse.json({ ata: ata.toBase58() });
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
