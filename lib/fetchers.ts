import { GetAtaResponse } from "@/app/api/rpc/getAta/route";
import { GetTokenInfoResponse } from "@/app/api/rpc/getTokenInfo/route";
import { RpcResponseAndContext } from "@solana/web3.js";

import { PADEL_TOKEN } from "@/lib/constants";
import { getBaseUrl } from "@/lib/utils";

export type RpcHttpResponse<T> = {
    jsonrpc: "string";
    result: RpcResponseAndContext<T>;
    id: number;
};

export async function fetcher<T>(url: string, options?: RequestInit) {
    const res = await fetch(url, options);

    if (!res.ok) {
        throw new Error(res.statusText);
    }

    return (await res.json()) as T;
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
