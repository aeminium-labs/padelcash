import { Suspense } from "react";
import { AuthChecker } from "@/app/auth-checker";

import { getBadges } from "@/lib/server/fetchers";
import { Badge } from "@/components/badge";
import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    params: {
        address: string;
    };
};

export default async function BadgesPage({ params }: Props) {
    const badges = await getBadges(params.address);

    return (
        <AuthChecker address={params.address}>
            <Container>
                <Suspense fallback={<Skeleton className="w-full grow" />}>
                    <div className="grid grid-flow-row grid-cols-2 gap-3">
                        {badges.total === 0 ? (
                            <p className="text-xs">No badges yet!</p>
                        ) : (
                            badges.items.map((badge) => (
                                <Badge
                                    key={`badge-${badge.id}`}
                                    type={badge.content?.metadata.symbol}
                                    image={badge.content?.links?.image}
                                    description={
                                        badge.content?.metadata.description
                                    }
                                    name={badge.content?.metadata.name}
                                    attributes={
                                        badge.content?.metadata.attributes
                                    }
                                />
                            ))
                        )}
                    </div>
                </Suspense>
            </Container>
        </AuthChecker>
    );
}

export const metadata = {
    title: "Badges",
};
