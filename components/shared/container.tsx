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
                "container flex min-h-[100dvh] flex-col px-4 py-20 pt-4",
                className
            )}
        >
            <div className="flex grow flex-col justify-start gap-4">
                {children}
            </div>
        </section>
    );
}
