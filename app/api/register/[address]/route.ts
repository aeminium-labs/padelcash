import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Data = { message: String };

const supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_ANON_KEY || ""
);

export async function POST(
    req: NextRequest,
    { params }: { params: { address: string } }
) {
    const walletAddress = params.address;
    const { email, name } = await req.json();

    const dbRes = await supabase
        .from("accounts")
        .upsert({ walletAddress, email, name }, { ignoreDuplicates: false });
    return NextResponse.json({ message: dbRes.statusText });
}
