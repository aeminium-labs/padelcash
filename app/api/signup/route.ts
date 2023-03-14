import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

import { supabase } from "@/lib/utils";

type Data = { message: String };

export async function POST(req: NextApiRequest) {
    const { email } = req.body;
    const dbRes = await supabase.from("signups").insert({ email });
    return NextResponse.json({ message: dbRes.statusText });
}
