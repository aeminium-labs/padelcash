"use client";

import { QrScanner } from "@yudiel/react-qr-scanner";

function ViewFinder() {
    return <></>;
}

export function QrCodeScanner() {
    return (
        <div className="h-80">
            <QrScanner
                onDecode={(result) => console.log(result)}
                onError={(error) => console.log(error?.message)}
                viewFinder={ViewFinder}
                containerStyle={{ height: 550 }}
                videoStyle={{ objectFit: "cover" }}
            />
        </div>
    );
}
