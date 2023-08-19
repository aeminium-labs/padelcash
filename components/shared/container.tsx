export function Container({ children }: { children: React.ReactNode }) {
    return (
        <section className="container flex flex-col justify-start gap-6 pt-20 px-4 pb-20 min-h-screen">
            {children}
        </section>
    );
}
