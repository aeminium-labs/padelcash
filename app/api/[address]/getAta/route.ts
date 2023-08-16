import { NextRequest, NextResponse } from "next/server";

import { PADEL_TOKEN } from "@/lib/constants";

export async function GET(
    req: NextRequest,
    { params }: { params: { address: string } }
) {
    const url = new URL(req.url);
    const mint = url.searchParams.get("mint");

    if (!mint?.length) {
        return NextResponse.json(
            { error: "no mint address sent" },
            { status: 500 }
        );
    }

    const res = await fetch(
        `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}`,
        {
            method: "POST",
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "getTokenAccountsByOwner",
                params: [
                    params.address,
                    {
                        mint: url.searchParams.get("mint"),
                    },
                    {
                        encoding: "jsonParsed",
                    },
                ],
            }),
        }
    );

    if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ ata: data.result.value[0].pubkey });
    } else {
        return NextResponse.json(
            { error: res.statusText },
            { status: res.status }
        );
    }
}
