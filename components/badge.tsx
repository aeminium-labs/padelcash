"use client";

import Image from "next/image";
import { DAS } from "helius-sdk";

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
    image?: string;
    name?: string;
    description?: string;
    attributes?: Array<DAS.Attribute>;
    type?: string;
};

const mapTypeToImage = {
    REG: `/badges/pioneer.png`,
    FIRST_TX: `/badges/first-transaction.png`,
    DEPOSIT: `/badges/first-deposit.png`,
};

export function Badge({
    image,
    name,
    description,
    attributes,
    type = "",
}: Props) {
    const badgeImage = image || mapTypeToImage[type];
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Card className="bg-primary text-primary-foreground">
                    <CardContent className="flex flex-col gap-1 p-1">
                        <div className="overflow-hidden rounded-xl">
                            {badgeImage && (
                                <Image
                                    src={badgeImage}
                                    alt={name || ""}
                                    width={150}
                                    height={150}
                                    className="aspect-square h-auto w-auto object-cover"
                                />
                            )}
                        </div>
                        <div className="py-2 text-center text-sm">
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
                    <div className="my-6 flex flex-col gap-4">
                        {attributes.map((attribute) => (
                            <div
                                className="flex grow flex-col gap-1 text-left"
                                key={`attributes-${attribute.trait_type}`}
                            >
                                <p className="text-xs text-muted-foreground">
                                    {attribute.trait_type}
                                </p>
                                <p className="text-sm font-medium leading-none">
                                    {attribute.value}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
