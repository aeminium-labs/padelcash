import { NextRequest, NextResponse } from "next/server";

import { FEE_PAYER_ADDRESS, PADEL_TOKEN } from "@/lib/constants";
import { fetcher } from "@/lib/fetchers";

export type TxCreateResponse = {
    tx: string;
};

type ShyftTransferRes = {
    success: boolean;
    message: string;
    result: {
        encoded_transaction: string;
        signers: Array<string>;
    };
    error: string;
};

export async function POST(request: NextRequest) {
    const { senderAddress, receiverAddress, amount } = await request.json();

    try {
        const createTx = await fetcher<ShyftTransferRes>(
            "https://api.shyft.to/sol/v1/token/transfer_detach",
            {
                method: "POST",
                headers: {
                    "x-api-key": process.env.SHYFT_API_KEY || "",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    network: "mainnet-beta",
                    from_address: senderAddress,
                    to_address: receiverAddress,
                    token_address: PADEL_TOKEN,
                    amount, // we don't need to add the decimals because the API handles that
                    fee_payer: FEE_PAYER_ADDRESS,
                }),
                redirect: "follow",
            }
        );

        if (createTx.success) {
            return NextResponse.json<TxCreateResponse>({
                tx: createTx.result.encoded_transaction,
            });
        }
    } catch (e) {
        console.log(e);
    }

    return NextResponse.json<TxCreateResponse>(
        {
            tx: "",
        },
        { status: 200 }
    );
}
