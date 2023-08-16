import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const iv = process.env.IV_KEY;
    const key = process.env.ENCRYPTION_KEY;

    if (body.code && key && iv) {
        const decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            Buffer.from(key, "hex"),
            Buffer.from(iv, "hex")
        );

        let decryptedData = decipher.update(body.code, "hex", "utf-8");

        decryptedData += decipher.final("utf8");

        return NextResponse.json({ params: decryptedData });
    }

    return NextResponse.json({
        error: "not able to retrieve url",
        status: 500,
    });
}
