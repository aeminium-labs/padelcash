import { NextRequest, NextResponse } from "next/server";

import { fetcher } from "@/lib/fetchers";

type Data = { message: String };

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_SECRET_KEY = process.env.DISCORD_SECRET_KEY;

export type LogoutResponse = {
    message: string;
};

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (body.token) {
        const data = new FormData();
        data.append("token", body.token);

        try {
            await fetcher("https://discord.com/api/oauth2/token/revoke", {
                method: "POST",
                body: data,
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${DISCORD_CLIENT_ID}:${DISCORD_SECRET_KEY}`
                    ).toString("base64")}`,
                },
            });

            return NextResponse.json({ message: "success" }, { status: 200 });
        } catch (e) {
            return NextResponse.json({ message: e }, { status: 400 });
        }
    }

    return NextResponse.json({ message: "ignored" }, { status: 200 });
}
