import { NextRequest, NextResponse } from "next/server";
import {
    createNonTransferableNftResponse,
    GetNftsResponse,
    UpsertNftResponse,
} from "@underdog-protocol/types";

import { fetcher } from "@/lib/fetchers";
import { getBaseUrl } from "@/lib/server/utils";

export type RegisterResponse = {
    status: string;
    id?: string;
};

export type BadgeType = "registration" | "firstTransaction";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const baseURL = getBaseUrl();

    const symbolsMap: Record<BadgeType, string> = {
        registration: "REG",
        firstTransaction: "FIRST_TX",
    };

    const configMap: Record<BadgeType, Object> = {
        registration: {
            attributes: {
                event: "Registration",
                type: "Pioneer",
                artist: "Padelcash",
            },
            name: "Pioneer",
            description:
                "Welcome to the Padelcash family! You get this badge when you're one of the first ones to register an account.",
            symbol: symbolsMap.registration,
            image: `${baseURL}/badges/pioneer.png`,
        },
        firstTransaction: {
            attributes: {
                event: "Transaction",
                type: "First",
                artist: "Padelcash",
            },
            name: "First transaction",
            description:
                "Woohoo you got your first transaction in! Did it feel... instant?!",
            symbol: symbolsMap.firstTransaction,
            image: `${baseURL}/badges/first-transaction.png`,
        },
    };

    if (body.address && body.badgeType) {
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

            const hasNFT = getNfts.results.some(
                (nft) => nft.symbol === symbolsMap[body.badgeType]
            );

            if (!hasNFT) {
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
                        ...configMap[body.badgeType],
                        receiverAddress: body.address,
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
    }

    return NextResponse.json({ status: "error" }, { status: 500 });
}