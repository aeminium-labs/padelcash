"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { QrScanner } from "@yudiel/react-qr-scanner";

import { Skeleton } from "@/components/ui/skeleton";

function ViewFinder() {
    return <></>;
}

export function EventsCodeScanner() {
    const params = useParams();
    const searchParams = useSearchParams();

    const from = Array.isArray(params.address)
        ? params.address[0]
        : params.address;

    const [code, setCode] = useState<string>(searchParams.get("code") || "");

    return (
        <div className="flex grow flex-col gap-4">
            <div className="relative flex w-full grow flex-col overflow-hidden rounded-xl">
                <Skeleton className="absolute h-full w-full grow" />
                <QrScanner
                    onDecode={(result) => {
                        setCode(result);
                    }}
                    onError={() => {}}
                    viewFinder={ViewFinder}
                    containerStyle={{ display: "flex", flexGrow: 1 }}
                    videoStyle={{ objectFit: "cover" }}
                />
            </div>
        </div>
    );
}
