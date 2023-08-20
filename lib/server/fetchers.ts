import { BadgesResponse } from "@/app/api/badges/route";
import { GetAtaResponse } from "@/app/api/rpc/getAta/route";
import { GetTokenInfoResponse } from "@/app/api/rpc/getTokenInfo/route";

import { PADEL_TOKEN } from "@/lib/constants";
import { fetcher } from "@/lib/fetchers";
import { getBaseUrl } from "@/lib/server/utils";

import "server-only";

export async function getBadges(address: string) {
    const baseUrl = getBaseUrl();

    return fetcher<BadgesResponse>(`${baseUrl}/api/badges`, {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify({
            address,
        }),
    });
}

export async function getTokenInfo(mint: string) {
    const baseUrl = getBaseUrl();

    return await fetcher<GetTokenInfoResponse>(
        `${baseUrl}/api/rpc/getTokenInfo`,
        {
            method: "POST",
            body: JSON.stringify({
                mint,
            }),
        }
    );
}

export async function getPadelAta(address: string) {
    const baseUrl = getBaseUrl();

    return fetcher<GetAtaResponse>(`${baseUrl}/api/rpc/getAta`, {
        method: "POST",
        body: JSON.stringify({
            address,
            mint: PADEL_TOKEN,
        }),
    });
}

export async function discordLogOut(data: FormData) {
    return fetcher("https://discord.com/api/oauth2/token/revoke", {
        method: "POST",
        body: data,
        headers: {
            Authorization: `Basic ${Buffer.from(
                `${process.env.DISCORD_CLIENT_ID}:${process.env.DISCORD_SECRET_KEY}`
            ).toString("base64")}`,
        },
    });
}