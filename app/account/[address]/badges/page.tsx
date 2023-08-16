import { AuthChecker } from "@/app/auth-checker";

import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    params: {
        address: string;
    };
};

export default async function BadgesPage({ params }: Props) {
    return (
        <AuthChecker address={params.address}>
            <Container>
                <Skeleton className="h-24 w-full" />
            </Container>
        </AuthChecker>
    );
}

export const metadata = {
    title: "Badges",
};
