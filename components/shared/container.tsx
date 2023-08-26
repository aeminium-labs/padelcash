import { cn } from "@/lib/utils";

export function Container({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section
            className={cn(
                "container flex h-[100dvh] flex-col justify-start gap-4 px-4 py-20",
                className
            )}
        >
            {children}
        </section>
    );
}
