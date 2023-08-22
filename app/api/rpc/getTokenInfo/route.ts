import { NextRequest, NextResponse } from "next/server";
import { TokenAmount } from "@solana/web3.js";

import { fetcher, RpcHttpResponse } from "@/lib/fetchers";
import { getBaseUrl } from "@/lib/server/utils";

export type GetTokenInfoResponse = {
    mint: string;
    supply: string;
    decimals: number;
};

export async function POST(req: NextRequest) {
    const { mint } = await req.json();
    const baseUrl = getBaseUrl();

    if (!mint?.length) {
        return NextResponse.json(
            { error: "no mint address sent" },
            { status: 500 }
        );
    }

    // Fetches Token info from RPC
    try {
        const res = await fetcher<RpcHttpResponse<TokenAmount>>(
            `${baseUrl}/api/rpc`,
            {
                method: "POST",
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: 1,
                    method: "getTokenSupply",
                    params: [mint],
                }),
            }
        );

        if (res.result.value) {
            return NextResponse.json<GetTokenInfoResponse>({
                mint,
                supply: res.result.value.amount,
                decimals: res.result.value.decimals,
            });
        }
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
