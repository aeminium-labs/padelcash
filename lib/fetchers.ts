import { BadgeType } from "@/app/api/badges/create/route";
import { PayCreateResponse } from "@/app/api/pay/create/route";
import { PayRetrieveResponse } from "@/app/api/pay/retrieve/route";
import { GetPriceResponse } from "@/app/api/prices/token/route";
import { TxConfirmResponse } from "@/app/api/tx/confirm/route";
import { TxCreateResponse } from "@/app/api/tx/create/route";
import { TxSendResponse } from "@/app/api/tx/send/route";
import { TxSignResponse } from "@/app/api/tx/sign/route";
import { RpcResponseAndContext } from "@solana/web3.js";

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

export async function retrievePaymentParams(code: string) {
    return fetcher<PayRetrieveResponse>("/api/pay/retrieve", {
        method: "POST",
        body: JSON.stringify({
            code,
        }),
    });
}

export async function createPaymentCode(params: string) {
    return fetcher<PayCreateResponse>("/api/pay/create", {
        method: "POST",
        body: JSON.stringify({
            params,
        }),
        cache: "force-cache",
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
    return fetcher<TxCreateResponse>("/api/tx/create", {
        method: "POST",
        body: JSON.stringify({
            senderAddress,
            receiverAddress,
            amount,
        }),
    });
}

export async function sendTx(signedTx: string) {
    return fetcher<TxSendResponse>("/api/tx/send", {
        method: "POST",
        body: JSON.stringify({
            signedTx,
        }),
    });
}

export async function confirmTx(txSignature: string) {
    return fetcher<TxConfirmResponse>("/api/tx/confirm", {
        method: "POST",
        body: JSON.stringify({
            txSignature,
        }),
    });
}

export async function signRelayerTx(signedTx: string) {
    return fetcher<TxSignResponse>("/api/tx/sign", {
        method: "POST",
        body: JSON.stringify({
            signedTx,
        }),
    });
}

export async function createBadge(address: string, badgeType: BadgeType) {
    return fetcher(`/api/badges/create`, {
        method: "POST",
        body: JSON.stringify({
            address,
            badgeType,
        }),
    });
}

export async function getTokenPrice(amount: number = 1, token?: string) {
    return fetcher<GetPriceResponse>(`/api/prices/token`, {
        method: "POST",
        body: JSON.stringify({
            amount,
            token,
        }),
    });
}
