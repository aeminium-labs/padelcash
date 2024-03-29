import { BadgesResponse } from "@/app/api/badges/route";
import { GetAtaResponse } from "@/app/api/rpc/getAta/route";
import { GetTokenInfoResponse } from "@/app/api/rpc/getTokenInfo/route";

import { PADEL_TOKEN, USDC_TOKEN } from "@/lib/constants";
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

export async function getUsdcAta(address: string) {
    const baseUrl = getBaseUrl();

    return fetcher<GetAtaResponse>(`${baseUrl}/api/rpc/getAta`, {
        method: "POST",
        body: JSON.stringify({
            address,
            mint: USDC_TOKEN,
        }),
    });
}

export async function getEvents(address: string) {
    const baseUrl = getBaseUrl();

    return fetcher<BadgesResponse>(`${baseUrl}/api/events`, {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify({
            address,
        }),
    });
}
