import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export type PayCreateResponse = {
    code: string;
};

export async function POST(req: NextRequest) {
    const body = await req.json();

    const iv = process.env.IV_KEY;
    const key = process.env.ENCRYPTION_KEY;

    if (body.params && key && iv) {
        let cipher = crypto.createCipheriv(
            "aes-256-cbc",
            Buffer.from(key, "hex"),
            Buffer.from(iv, "hex")
        );

        let encryptedData = cipher.update(body.params, "utf-8", "hex");

        encryptedData += cipher.final("hex");

        return NextResponse.json({ code: encryptedData });
    }

    return NextResponse.json({ error: "not able to create code", status: 500 });
}
