"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QrScanner } from "@yudiel/react-qr-scanner";

function ViewFinder() {
    return <></>;
}

export function QrCodeScanner() {
    const [code, setCode] = useState<string>("");
    const router = useRouter();
    const params = useSearchParams();

    const to = params.get("to");
    const amount = params.get("amount");

    useEffect(() => {
        async function getUrl() {
            const res = await fetch(`/api/pay/retrieve`, {
                method: "POST",
                body: JSON.stringify({
                    code,
                }),
            });

            if (res.ok) {
                const data = await res.json();

                if (data.params) {
                    router.replace(`?${data.params}`);
                }
            }
        }

        if (code.length > 0) {
            getUrl();
        }
    }, [code]);

    if (to && amount) {
        return <>somethi</>;
    }

    return (
        <div className="rounded-md overflow-hidden">
            <QrScanner
                onDecode={(result) => {
                    setCode(result);
                }}
                onError={(error) => console.log(error?.message)}
                viewFinder={ViewFinder}
                containerStyle={{ height: 500 }}
                videoStyle={{ objectFit: "cover" }}
            />
        </div>
    );
}
