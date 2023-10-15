import { AccountBalances } from "@/app/account/[address]/page";
import { AuthChecker } from "@/app/auth-checker";
import { gql } from "graphql-request";

import { graphQLClient } from "@/lib/graphql";
import { PaymentsCodeGenerator } from "@/components/payments-code-generator";
import { PaymentsCodeScanner } from "@/components/payments-code-scanner";
import { Container } from "@/components/shared/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
    params: {
        address: string;
    };
    searchParams?: {
        code: string;
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

    if (searchParams?.code) {
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
                    <TabsContent
                        value="receive"
                        className="flex grow flex-col data-[state=inactive]:hidden"
                    >
                        <PaymentsCodeGenerator to={params.address} />
                    </TabsContent>
                    <TabsContent
                        value="send"
                        className="flex grow flex-col data-[state=inactive]:hidden"
                    >
                        <PaymentsCodeScanner balancesData={balancesData} />
                    </TabsContent>
                </Tabs>
            </Container>
        </AuthChecker>
    );
}
