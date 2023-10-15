import { BadgeType } from "@/app/api/badges/create/route";
import { LoginResponse } from "@/app/api/login/route";
import { PayCreateResponse } from "@/app/api/pay/create/route";
import { PayRetrieveResponse } from "@/app/api/pay/retrieve/route";
import { GetPriceResponse } from "@/app/api/token/price/route";
import {
    GetQuoteResponse,
    JupiterSwapQuoteResponse,
} from "@/app/api/token/quote/route";
import { GetSwapResponse } from "@/app/api/token/swap/route";
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

export async function createPaymentCode(to: string, amount: number) {
    return fetcher<PayCreateResponse>("/api/pay/create", {
        method: "POST",
        body: JSON.stringify({
            to,
            amount,
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

export async function signRelayerVersionTx(signedTx: string) {
    return fetcher<TxSignResponse>("/api/tx/sign_versioned", {
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
    return fetcher<GetPriceResponse>(`/api/token/price`, {
        method: "POST",
        body: JSON.stringify({
            amount,
            token,
        }),
    });
}

export async function getTokenQuote({
    fromToken,
    toToken,
    amount,
}: {
    fromToken: string;
    toToken: string;
    amount: number;
}) {
    return fetcher<GetQuoteResponse>(`/api/token/quote`, {
        method: "POST",
        body: JSON.stringify({
            fromToken,
            toToken,
            amount,
        }),
    });
}

export async function getTokenSwapTransaction({
    quote,
    address,
}: {
    quote: JupiterSwapQuoteResponse;
    address: string;
}) {
    return fetcher<GetSwapResponse>(`/api/token/swap`, {
        method: "POST",
        body: JSON.stringify({
            quote,
            address,
        }),
    });
}

export async function login(token: string | null) {
    return fetcher<LoginResponse>("/api/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
}
