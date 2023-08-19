export function Container({ children }: { children: React.ReactNode }) {
    return (
        <section className="container flex min-h-screen flex-col justify-start gap-6 px-4 py-20">
            {children}
        </section>
    );
}
