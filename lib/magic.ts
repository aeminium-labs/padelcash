import { SolanaExtension } from "@magic-ext/solana";
import { Magic } from "magic-sdk";

const createMagic = (key: string | undefined) => {
    // We make sure that the window object is available
    // Then we create a new instance of Magic using a publishable key

    if (typeof window !== "undefined" && key) {
        return new Magic(key, {
            extensions: [
                new SolanaExtension({
                    rpcUrl: `${location.protocol}//${location.host}/api/rpc`,
                }),
            ],
        });
    }
};

// Pass in your publishable key from your .env file
export const magic = createMagic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
