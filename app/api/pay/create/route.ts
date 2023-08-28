import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export type PayCreateResponse = {
    code: string;
};

export async function POST(req: NextRequest) {
    const body = await req.json();

    const iv = process.env.IV_KEY;
    const key = process.env.ENCRYPTION_KEY;

    if (body.to && body.amount && key && iv) {
        try {
            let cipher = crypto.createCipheriv(
                "aes-256-cbc",
                Buffer.from(key, "hex"),
                Buffer.from(iv, "hex")
            );

            const data = JSON.stringify({
                to: body.to,
                amount: body.amount,
                generated: new Date(),
            });

            let code = cipher.update(data, "utf-8", "hex");

            code += cipher.final("hex");

            return NextResponse.json({ code });
        } catch (e) {
            return NextResponse.json({
                error: "not able to create code",
                status: 500,
            });
        }
    }

    return NextResponse.json({ error: "not able to create code", status: 500 });
}
