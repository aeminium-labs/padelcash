import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: { address: string } }
) {
    // add code for minting nft

    return NextResponse.json({ message: "success" });
}
