import { NextRequest, NextResponse } from "next/server";
import { GetNftsResponse } from "@underdog-protocol/types";

import { fetcher } from "@/lib/fetchers";

export type BadgesResponse = GetNftsResponse;

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (body.address) {
        try {
            const getNfts = await fetcher<GetNftsResponse>(
                `https://api.underdogprotocol.com/v2/projects/c/2/nfts?page=1&limit=100&ownerAddress=${body.address}`,
                {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                        authorization: `Bearer ${process.env.UNDERDOG_API_KEY}`,
                    },
                }
            );

            return NextResponse.json(getNfts);
        } catch (e) {
            console.log(e);
        }
    }

    return NextResponse.json({}, { status: 500 });
}
