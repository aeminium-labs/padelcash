export function Container({ children }: { children: React.ReactNode }) {
    return (
        <section className="container grid items-center gap-6 pt-6 px-4">
            {children}
        </section>
    );
}
