import { NextRequest, NextResponse } from "next/server";

import { fetcher } from "@/lib/fetchers";

export type TxSignResponse = {
    signedTx: string;
};

type ShyftSignRes = {
    success: boolean;
    message: string;
    result: {
        tx: string;
    };
    error: string;
};

export async function POST(req: NextRequest) {
    const { signedTx } = await req.json();

    try {
        const signTx = await fetcher<ShyftSignRes>(
            "https://api.shyft.to/sol/v1/txn_relayer/sign",
            {
                method: "POST",
                headers: {
                    "x-api-key": process.env.SHYFT_API_KEY || "",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    network: "mainnet-beta",
                    encoded_transaction: signedTx,
                }),
                redirect: "follow",
            }
        );

        if (signTx.success) {
            return NextResponse.json<TxSignResponse>({
                signedTx: signTx.result.tx,
            });
        }
    } catch (e) {
        console.log(e);
    }

    return NextResponse.json<TxSignResponse>(
        {
            signedTx: "",
        },
        { status: 200 }
    );
}
