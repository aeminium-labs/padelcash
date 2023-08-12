import { NextRequest, NextResponse } from "next/server";

type Data = { message: String };

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_SECRET_KEY = process.env.DISCORD_SECRET_KEY;

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (body.token) {
        const data = new FormData();
        data.append("token", body.token);

        const response = await fetch(
            "https://discord.com/api/oauth2/token/revoke",
            {
                method: "POST",
                body: data,
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${DISCORD_CLIENT_ID}:${DISCORD_SECRET_KEY}`
                    ).toString("base64")}`,
                },
            }
        );

        if (response.ok) {
            return NextResponse.json({ message: "success" }, { status: 200 });
        } else {
            return NextResponse.json(
                { message: "error" },
                { status: response.status }
            );
        }
    }

    return NextResponse.json({ message: "ignored" }, { status: 200 });
}
