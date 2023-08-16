import { AuthChecker } from "@/app/auth-checker";

import { QrCodeGenerator } from "@/components/qrcode-generator";
import { QrCodeScanner } from "@/components/qrcode-scanner";
import { Container } from "@/components/shared/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
    params: {
        address: string;
    };
    searchParams?: {
        to: string;
        amount: string;
    };
};

export default async function PaymentsPage({ params, searchParams }: Props) {
    console.log(searchParams);
    let defaultTab = "receive";

    if (searchParams?.to) {
        defaultTab = "send";
    }

    return (
        <AuthChecker address={params.address}>
            <Container>
                <Tabs defaultValue={defaultTab}>
                    <TabsList className="w-full mb-4">
                        <TabsTrigger value="receive" className="w-full">
                            Receive
                        </TabsTrigger>
                        <TabsTrigger value="send" className="w-full">
                            Send
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="receive">
                        <QrCodeGenerator to={params.address} />
                    </TabsContent>
                    <TabsContent value="send">
                        <QrCodeScanner />
                    </TabsContent>
                </Tabs>
            </Container>
        </AuthChecker>
    );
}
