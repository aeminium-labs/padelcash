"use client";

import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

type Props = {
    image: string;
    name: string;
    description?: string;
    attributes?: Record<string, string | number>;
};

export function Badge({ image, name, description, attributes }: Props) {
    return (
        <Sheet>
            <SheetTrigger>
                <Card className="bg-primary text-primary-foreground">
                    <CardContent className="p-1 flex flex-col gap-1">
                        <div className="overflow-hidden rounded-xl">
                            <Image
                                src={image}
                                alt={name}
                                width={150}
                                height={150}
                                className="h-auto w-auto object-cover aspect-square"
                            />
                        </div>
                        <div className="py-2 text-sm text-center">
                            <p className="font-medium leading-none">{name}</p>
                        </div>
                    </CardContent>
                </Card>
            </SheetTrigger>
            <SheetContent side="bottom">
                <SheetHeader className="text-left">
                    <SheetTitle className="text-teal-500">{name}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>
                {attributes && (
                    <div className="flex flex-col gap-4 my-6">
                        {Object.entries(attributes).map(([key, value]) => (
                            <div className="flex flex-col gap-1 grow text-left">
                                <p className="text-xs text-muted-foreground">
                                    {key}
                                </p>
                                <p className="text-sm font-medium leading-none">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
