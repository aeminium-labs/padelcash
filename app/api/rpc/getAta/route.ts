import { NextRequest, NextResponse } from "next/server";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { AccountInfo, ParsedAccountData, PublicKey } from "@solana/web3.js";

import { fetcher, RpcHttpResponse } from "@/lib/fetchers";
import { getBaseUrl } from "@/lib/utils";

export type GetAtaResponse = {
    ata: string;
    created: boolean;
};

type TokenAccountInfo = {
    account: AccountInfo<ParsedAccountData>;
    pubkey: string;
};

export async function POST(req: NextRequest) {
    const { address, mint } = await req.json();
    const baseUrl = getBaseUrl();

    if (!mint?.length) {
        return NextResponse.json(
            { error: "no mint address sent" },
            { status: 500 }
        );
    }

    if (!address?.length) {
        return NextResponse.json(
            { error: "no account address sent" },
            { status: 500 }
        );
    }

    // Fetches ATA from RPC. This only returns a value if it's already created.
    try {
        const accountInfo = await fetcher<RpcHttpResponse<[TokenAccountInfo]>>(
            `${baseUrl}/api/rpc`,
            {
                method: "POST",
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: 1,
                    method: "getTokenAccountsByOwner",
                    params: [
                        address,
                        {
                            mint,
                        },
                        {
                            encoding: "jsonParsed",
                        },
                    ],
                }),
            }
        );

        if (accountInfo.result.value.length > 0) {
            return NextResponse.json({
                ata: accountInfo.result.value[0].pubkey,
                created: true,
            });
        }

        // Fallback to SPL token so we still get the ATA even if it's not created yet
        const newAta = await getAssociatedTokenAddress(
            new PublicKey(mint), // token
            new PublicKey(address) // owner
        );

        return NextResponse.json<GetAtaResponse>({
            ata: newAta.toBase58(),
            created: false,
        });
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
