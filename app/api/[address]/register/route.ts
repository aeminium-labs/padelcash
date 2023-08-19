import { NextRequest, NextResponse } from "next/server";
import {
    createNonTransferableNftResponse,
    GetNftsResponse,
    UpsertNftResponse,
} from "@underdog-protocol/types";

import { fetcher } from "@/lib/fetchers";
import { getBaseUrl } from "@/lib/utils";

export type RegisterResponse = {
    status: string;
    id?: string;
};

export async function POST(
    _: NextRequest,
    { params }: { params: { address: string } }
) {
    const baseURL = getBaseUrl();
    try {
        const getNfts = await fetcher<GetNftsResponse>(
            `https://api.underdogprotocol.com/v2/projects/c/2/nfts?page=1&limit=100&ownerAddress=${params.address}`,
            {
                method: "GET",
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${process.env.UNDERDOG_API_KEY}`,
                },
            }
        );

        const hasRegistrationNFT = getNfts.results.some(
            (nft) => nft.symbol === "REG"
        );

        if (!hasRegistrationNFT) {
            const mintNft = await fetcher<
                createNonTransferableNftResponse | UpsertNftResponse
            >("https://api.underdogprotocol.com/v2/projects/c/2/nfts", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    authorization: `Bearer ${process.env.UNDERDOG_API_KEY}`,
                },
                body: JSON.stringify({
                    attributes: {
                        event: "Registration",
                        type: "Pioneer",
                        artist: "Padelcash",
                    },
                    upsert: true, // do upsert just in case so we don't create duplicates
                    name: "Pioneer",
                    description:
                        "Welcome to the Padelcash family! You get this badge when you're one of the first ones to register an account.",
                    symbol: "REG",
                    image: `${baseURL}/badges/pioneer.png`,
                    receiverAddress: params.address,
                }),
            });

            const { status, id } = Array.isArray(mintNft)
                ? mintNft[0]
                : mintNft;
            return NextResponse.json({ status, id });
        }

        return NextResponse.json({ status: "pass" });
    } catch (e) {
        console.log(e);
    }

    return NextResponse.json({ status: "error" }, { status: 500 });
}
