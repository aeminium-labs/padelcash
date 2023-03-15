import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_ANON_KEY || ""
);

type Data = { message: String };

export async function POST(req: NextApiRequest) {
    const { email } = req.body;
    const dbRes = await supabase.from("signups").insert({ email });
    return NextResponse.json({ message: dbRes.statusText });
}
