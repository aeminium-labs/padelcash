import { BadgesResponse } from "@/app/api/[address]/badges/route";
import { PayCreateResponse } from "@/app/api/pay/create/route";
import { PayRetrieveResponse } from "@/app/api/pay/retrieve/route";
import { GetAtaResponse } from "@/app/api/rpc/getAta/route";
import { GetTokenInfoResponse } from "@/app/api/rpc/getTokenInfo/route";
import { TxConfirmResponse } from "@/app/api/tx/confirm/route";
import { TxCreateResponse } from "@/app/api/tx/create/route";
import { TxSendResponse } from "@/app/api/tx/send/route";
import { TxSignResponse } from "@/app/api/tx/sign/route";
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

export async function retrievePaymentParams(code: string) {
    const baseUrl = getBaseUrl();

    return fetcher<PayRetrieveResponse>(`${baseUrl}/api/pay/retrieve`, {
        method: "POST",
        body: JSON.stringify({
            code,
        }),
    });
}

export async function createPaymentCode(params: string) {
    const baseUrl = getBaseUrl();

    return fetcher<PayCreateResponse>(`${baseUrl}/api/pay/create`, {
        method: "POST",
        body: JSON.stringify({
            params,
        }),
    });
}

export async function createTx({
    senderAddress,
    receiverAddress,
    amount,
}: {
    senderAddress: string;
    receiverAddress: string;
    amount: number;
}) {
    const baseUrl = getBaseUrl();
    return fetcher<TxCreateResponse>(`${baseUrl}/api/tx/create`, {
        method: "POST",
        body: JSON.stringify({
            senderAddress,
            receiverAddress,
            amount,
        }),
    });
}

export async function sendTx(signedTx: string) {
    const baseUrl = getBaseUrl();

    return fetcher<TxSendResponse>(`${baseUrl}/api/tx/send`, {
        method: "POST",
        body: JSON.stringify({
            signedTx,
        }),
    });
}

export async function confirmTx(txSignature: string) {
    const baseUrl = getBaseUrl();

    return fetcher<TxConfirmResponse>(`${baseUrl}/api/tx/confirm`, {
        method: "POST",
        body: JSON.stringify({
            txSignature,
        }),
    });
}

export async function signRelayerTx(signedTx: string) {
    const baseUrl = getBaseUrl();

    return fetcher<TxSignResponse>(`${baseUrl}/api/tx/sign`, {
        method: "POST",
        body: JSON.stringify({
            signedTx,
        }),
    });
}

export async function getBadges(address: string) {
    const baseUrl = getBaseUrl();

    return fetcher<BadgesResponse>(`${baseUrl}/api/${address}/badges`, {
        method: "POST",
        cache: "no-store",
    });
}
