import { NextRequest, NextResponse } from "next/server";
import { DAS, Helius } from "helius-sdk";

import { COLLECTION_MINT } from "@/lib/constants";

export type BadgesResponse = DAS.GetAssetResponseList;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const helius = new Helius(process.env.HELIUS_API_KEY || "");

    if (body.address) {
        try {
            const nfts = await helius.rpc.searchAssets({
                ownerAddress: body.address,
                grouping: ["collection", COLLECTION_MINT],
                compressed: true,
                page: 1,
                limit: 100,
            });

            return NextResponse.json(nfts);
        } catch (e) {
            console.log(e);
        }
    }

    return NextResponse.json({}, { status: 500 });
}
