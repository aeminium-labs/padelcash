import { NextRequest, NextResponse } from "next/server";
import { Helius } from "helius-sdk";

import { BADGES_COLLECTION_MINT } from "@/lib/constants";

export type CreateBadgeResponse = {
    status: string;
    id?: string;
};

export type BadgeType = "registration" | "firstTransaction" | "firstDeposit";
export type BadgeSymbol = "REG" | "FIRST_TX" | "DEPOSIT";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const baseURL = process.env.VERCEL_URL || "www.padel.cash";
    const helius = new Helius(process.env.HELIUS_API_KEY || "");
    const timestamp = Date.now();
    const additionalAttributes = body.additionalAtributes || [];

    const symbolsMap: Record<BadgeType, BadgeSymbol> = {
        registration: "REG",
        firstTransaction: "FIRST_TX",
        firstDeposit: "DEPOSIT",
    };

    const configMap: Record<BadgeType, Object> = {
        registration: {
            name: "Registered",
            description:
                "Welcome to the Padelcash family! You get this badge when you register an account.",
            symbol: symbolsMap.registration,
            collection: BADGES_COLLECTION_MINT,
            // imagePath: `https://${baseURL}/badges/pioneer.png`,
            attributes: [
                {
                    trait_type: "event",
                    value: "Registration",
                },
                {
                    trait_type: "type",
                    value: "Registered",
                },
                {
                    trait_type: "artist",
                    value: "Padelcash",
                },
                {
                    trait_type: "timestamp",
                    value: `${timestamp}`,
                },
                ...additionalAttributes,
            ],
        },
        firstTransaction: {
            name: "First transaction",
            description:
                "Woohoo you got your first transaction in! Did it feel... instant?!",
            symbol: symbolsMap.firstTransaction,
            collection: BADGES_COLLECTION_MINT,
            // imagePath: `https://${baseURL}/badges/first-transaction.png`,
            attributes: [
                {
                    trait_type: "event",
                    value: "Transaction",
                },
                {
                    trait_type: "type",
                    value: "First",
                },
                {
                    trait_type: "artist",
                    value: "Padelcash",
                },
                {
                    trait_type: "timestamp",
                    value: `${timestamp}`,
                },
                ...additionalAttributes,
            ],
        },
        firstDeposit: {
            name: "First deposit",
            description:
                "You've just opened your new savings account and it didn't even cost you a pennie!",
            symbol: symbolsMap.firstDeposit,
            collection: BADGES_COLLECTION_MINT,
            // imagePath: `https://${baseURL}/badges/first-deposit.png`,
            attributes: [
                {
                    trait_type: "event",
                    value: "Deposit",
                },
                {
                    trait_type: "type",
                    value: "First",
                },
                {
                    trait_type: "artist",
                    value: "Padelcash",
                },
                {
                    trait_type: "timestamp",
                    value: `${timestamp}`,
                },
                ...additionalAttributes,
            ],
        },
    };

    if (body.address && body.badgeType) {
        try {
            const nfts = await helius.rpc.searchAssets({
                ownerAddress: body.address,
                grouping: ["collection", BADGES_COLLECTION_MINT],
                compressed: true,
                page: 1,
                limit: 100,
            });

            const hasNFT = nfts.items.some(
                (nft) =>
                    nft.content?.metadata.symbol === symbolsMap[body.badgeType]
            );

            if (!hasNFT) {
                const mintResponse = await helius.mintCompressedNft({
                    ...configMap[body.badgeType],
                    owner: body.address,
                });

                return NextResponse.json({
                    status: "success",
                    id: mintResponse.result.assetId,
                });
            }

            return NextResponse.json({ status: "pass" });
        } catch (e) {
            console.log(e);
        }
    }

    return NextResponse.json({ status: "error" }, { status: 500 });
}
