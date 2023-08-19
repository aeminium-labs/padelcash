import { AuthChecker } from "@/app/auth-checker";

import { getBadges } from "@/lib/fetchers";
import { Badge } from "@/components/badge";
import { Container } from "@/components/shared/container";

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
                <div className="grid grid-flow-row gap-3 grid-cols-2">
                    {badges.totalResults === 0 ? (
                        <p className="text-xs">No badges yet!</p>
                    ) : (
                        badges.results.map((badge) => (
                            <Badge
                                key={`badge-${badge.id}`}
                                image={badge.image}
                                description={badge.description}
                                name={badge.name}
                                attributes={badge.attributes}
                            />
                        ))
                    )}
                </div>
            </Container>
        </AuthChecker>
    );
}

export const metadata = {
    title: "Badges",
};
