import { Sidebar } from "@/app/account/sidebar";

type Props = {
    children: React.ReactNode;
    params: {
        address: string;
    };
};

export default function AccountLayout({ children, params }: Props) {
    return (
        <section className="container grid grid-cols-4 items-center gap-2 xl:grid-cols-5">
            <div className="col-span-3 self-stretch border-r border-r-slate-700 xl:col-span-4">
                <div className="h-full py-4 pr-2">{children}</div>
            </div>
            <Sidebar accountAddress={params.address} />
        </section>
    );
}
