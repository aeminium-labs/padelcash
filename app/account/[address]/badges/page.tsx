type Props = {
    params: {
        address: string;
    };
};

export default async function BadgesPage({ params }: Props) {
    return <section className="grid items-center gap-10">Soon</section>;
}

export const metadata = {
    title: "Badges",
};
