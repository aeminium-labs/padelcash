"use client";

import { useEffect } from "react";

import { Container } from "@/components/shared/container";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <Container>
            <h2>Something went wrong!</h2>
        </Container>
    );
}
