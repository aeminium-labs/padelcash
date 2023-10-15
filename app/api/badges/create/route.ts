import { NextRequest, NextResponse } from "next/server";
import { Helius } from "helius-sdk";

import { COLLECTION_MINT } from "@/lib/constants";

export type RegisterResponse = {
    status: string;
    id?: string;
};

export type BadgeType = "registration" | "firstTransaction" | "firstDeposit";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const baseURL = process.env.VERCEL_URL || "www.padel.cash";
    const helius = new Helius(process.env.HELIUS_API_KEY || "");

    const symbolsMap: Record<BadgeType, string> = {
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
            collection: COLLECTION_MINT,
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
            ],
        },
        firstTransaction: {
            name: "First transaction",
            description:
                "Woohoo you got your first transaction in! Did it feel... instant?!",
            symbol: symbolsMap.firstTransaction,
            collection: COLLECTION_MINT,
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
            ],
        },
        firstDeposit: {
            name: "First deposit",
            description:
                "You've just opened your new savings account and it didn't even cost you a pennie!",
            symbol: symbolsMap.firstDeposit,
            collection: COLLECTION_MINT,
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
            ],
        },
    };

    if (body.address && body.badgeType) {
        try {
            const nfts = await helius.rpc.getAssetsByOwner({
                ownerAddress: body.address,
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
