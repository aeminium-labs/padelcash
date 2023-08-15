import { AuthChecker } from "@/app/auth-checker";

import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    params: {
        address: string;
    };
};

export default async function BadgesPage({ params }: Props) {
    return (
        <AuthChecker address={params.address}>
            <section className="container grid items-center gap-6 pt-6 px-4">
                <Skeleton className="h-24 w-full" />
            </section>
        </AuthChecker>
    );
}
export const metadata = {
    title: "Pay",
};
