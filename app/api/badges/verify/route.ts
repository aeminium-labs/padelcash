import { NextRequest, NextResponse } from "next/server";
import { Helius } from "helius-sdk";

import { BADGES_COLLECTION_MINT } from "@/lib/constants";

export type VerifyBadgeResponse = {
    exists: boolean;
};

export async function POST(req: NextRequest) {
    const body = await req.json();
    const helius = new Helius(process.env.HELIUS_API_KEY || "");
    const symbol = body.badgeSymbol || "REG";

    if (body.address) {
        try {
            const nfts = await helius.rpc.searchAssets({
                ownerAddress: body.address,
                grouping: ["collection", BADGES_COLLECTION_MINT],
                compressed: true,
                page: 1,
                limit: 100,
            });

            const exists = nfts.items.some(
                (nft) => nft.content?.metadata.symbol === symbol
            );

            return NextResponse.json({ exists }, { status: 200 });
        } catch (e) {
            console.log(e);
        }
    }

    return NextResponse.json({ exists: false }, { status: 500 });
}
