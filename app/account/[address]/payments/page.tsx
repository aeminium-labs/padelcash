import { AccountBalances } from "@/app/account/[address]/page";
import { AuthChecker } from "@/app/auth-checker";
import { gql } from "graphql-request";

import { graphQLClient } from "@/lib/graphql";
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

const getBalances = async (address: string) => {
    const query = gql`
        query getBalances($address: String!) {
            account(address: $address) {
                balances {
                    tokens {
                        amount
                        amountUSD
                        decimals
                        mint
                    }
                }
            }
        }
    `;

    return graphQLClient.request<AccountBalances>(query, { address });
};

export default async function PaymentsPage({ params, searchParams }: Props) {
    let defaultTab = "receive";

    if (searchParams?.to) {
        defaultTab = "send";
    }

    const balancesData = await getBalances(params.address);

    return (
        <AuthChecker address={params.address}>
            <Container>
                <Tabs defaultValue={defaultTab} className="flex grow flex-col">
                    <TabsList className="mb-2 w-full">
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
                    <TabsContent value="send" className="flex grow flex-col">
                        <QrCodeScanner balancesData={balancesData} />
                    </TabsContent>
                </Tabs>
            </Container>
        </AuthChecker>
    );
}
