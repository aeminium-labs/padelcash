import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const supportedDomains = process.env.CORS_ALLOW_ORIGIN
        ? process.env.CORS_ALLOW_ORIGIN.split(",")
        : undefined;
    const corsHeaders: Record<string, string> = {
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "*",
    };

    if (supportedDomains) {
        const origin = request.headers.get("Origin");
        if (origin && supportedDomains.includes(origin)) {
            corsHeaders["Access-Control-Allow-Origin"] = origin;
        }
    } else {
        corsHeaders["Access-Control-Allow-Origin"] = "*";
    }

    const upgradeHeader = request.headers.get("Upgrade");

    if (upgradeHeader || upgradeHeader === "websocket") {
        return await fetch(
            `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
            request
        );
    }

    const payload = await request.text();

    const proxyRequest = new Request(
        `https://mainnet.helius-rpc.com?api-key=${process.env.HELIUS_API_KEY}`,
        {
            method: request.method,
            body: payload || null,
            headers: {
                "Content-Type": "application/json",
                "X-Helius-Cloudflare-Proxy": "true",
            },
        }
    );

    const res = await fetch(proxyRequest);

    return new Response(res.body, {
        status: res.status,
        headers: corsHeaders,
    });
}

export async function OPTIONS(request: NextRequest) {
    const supportedDomains = process.env.CORS_ALLOW_ORIGIN
        ? process.env.CORS_ALLOW_ORIGIN.split(",")
        : undefined;
    const corsHeaders: Record<string, string> = {
        "Access-Control-Allow-Methods": "OPTIONS",
        "Access-Control-Allow-Headers": "*",
    };

    if (supportedDomains) {
        const origin = request.headers.get("Origin");
        if (origin && supportedDomains.includes(origin)) {
            corsHeaders["Access-Control-Allow-Origin"] = origin;
        }
    } else {
        corsHeaders["Access-Control-Allow-Origin"] = "*";
    }

    return new Response(null, {
        status: 200,
        headers: corsHeaders,
    });
}
