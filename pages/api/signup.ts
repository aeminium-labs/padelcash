import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/lib/utils";

type Data = { message: String };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "POST") {
        const { email } = req.body;
        const dbRes = await supabase.from("signups").insert({ email });
        res.status(dbRes.status).json({ message: dbRes.statusText });
    } else {
        res.status(405).json({ message: "Only do POST" });
    }
}
