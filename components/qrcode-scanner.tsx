"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QrScanner } from "@yudiel/react-qr-scanner";

function ViewFinder() {
    return <></>;
}

export function QrCodeScanner() {
    const [code, setCode] = useState<string>("");
    const router = useRouter();

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

                console.log("cam", data);

                // if (data) {
                //     router.push(`${baseUrl}/pay/${data.code}`);
                // }
            }
        }

        if (code.length > 0) {
            getUrl();
        }
    }, [code]);

    if (code.length > 0) {
        return <>somethi</>;
    }

    return (
        <div className="h-80">
            <QrScanner
                onDecode={(result) => {
                    setCode(result);
                }}
                onError={(error) => console.log(error?.message)}
                viewFinder={ViewFinder}
                containerStyle={{ height: 550 }}
                videoStyle={{ objectFit: "cover" }}
            />
        </div>
    );
}
