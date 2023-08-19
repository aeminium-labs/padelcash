import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
    return (
        <Container>
            <Skeleton className="min-h-36 w-full grow" />
        </Container>
    );
}
