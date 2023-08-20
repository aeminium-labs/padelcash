import { NextRequest, NextResponse } from "next/server";

import { discordLogOut } from "@/lib/server/fetchers";

export type LogoutResponse = {
    message: string;
};

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (body.token) {
        const data = new FormData();
        data.append("token", body.token);

        try {
            await discordLogOut(data);

            return NextResponse.json({ message: "success" }, { status: 200 });
        } catch (e) {
            return NextResponse.json({ message: e }, { status: 400 });
        }
    }

    return NextResponse.json({ message: "ignored" }, { status: 200 });
}
