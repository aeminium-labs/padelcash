export function Container({ children }: { children: React.ReactNode }) {
    return (
        <section className="container grid items-center gap-6 pt-20 px-4 pb-20">
            {children}
        </section>
    );
}
