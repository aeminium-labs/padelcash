import { AuthChecker } from "@/app/auth-checker";

import { getEvents } from "@/lib/server/fetchers";
import { EventsCodeScanner } from "@/components/events-code-scanner";
import { Container } from "@/components/shared/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
    params: {
        address: string;
    };
    searchParams?: {
        code: string;
    };
};

export default async function EventsPage({ params, searchParams }: Props) {
    let defaultTab = "events";

    const events = await getEvents(params.address);

    return (
        <AuthChecker address={params.address}>
            <Container>
                <Tabs defaultValue={defaultTab} className="flex grow flex-col">
                    <TabsList className="mb-2 w-full">
                        <TabsTrigger value="events" className="w-full">
                            Events
                        </TabsTrigger>
                        <TabsTrigger value="scan" className="w-full">
                            Scan
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="events"
                        className="flex grow flex-col data-[state=inactive]:hidden"
                    >
                        {events.total === 0 ? (
                            <p className="text-lg text-slate-400 sm:text-xl">
                                No events yet
                            </p>
                        ) : (
                            <p className="text-xs">Soon!</p>
                        )}
                    </TabsContent>
                    <TabsContent
                        value="scan"
                        className="flex grow flex-col data-[state=inactive]:hidden"
                    >
                        <EventsCodeScanner />
                    </TabsContent>
                </Tabs>
            </Container>
        </AuthChecker>
    );
}
