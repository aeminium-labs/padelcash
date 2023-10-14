import { NextRequest, NextResponse } from "next/server";
import { Magic } from "@magic-sdk/admin";

// Create an instance of magic admin using our secret key (not our publishable key)
let mAdmin = new Magic(process.env.MAGIC_SECRET_KEY);

export type LoginResponse = {
    authenticated: boolean;
    error?: string;
};

export function POST(req: NextRequest) {
    try {
        const authHeaders = req.headers.get("authorization");

        if (authHeaders) {
            // Grab the DID token from our headers and parse it
            const didToken = mAdmin.utils.parseAuthorizationHeader(authHeaders);

            // Validate the token and send back a successful response
            mAdmin.token.validate(didToken);
            return NextResponse.json({ authenticated: true }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json(
            { authenticated: false, error: error.message },
            { status: 500 }
        );
    }
}
