import { SolanaExtension } from "@magic-ext/solana";
import { InstanceWithExtensions, SDKBase } from "@magic-sdk/provider";
import { Transaction } from "@solana/web3.js";
import { Magic } from "magic-sdk";

import { getAppUrl } from "@/lib/utils";

const clientId = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY;
const url = getAppUrl();
export type Status = "init" | "connecting" | "connected" | "errored";

export class Auth {
    private magic:
        | InstanceWithExtensions<SDKBase, SolanaExtension[]>
        | undefined;

    constructor() {}

    init = () => {
        function createMagic(key: string | undefined) {
            // We make sure that the window object is available
            // Then we create a new instance of Magic using a publishable key
            if (typeof window !== "undefined" && key) {
                return new Magic(key, {
                    extensions: [
                        new SolanaExtension({
                            rpcUrl: `${url}/api/rpc`,
                        }),
                    ],
                });
            }
        }

        this.magic = createMagic(clientId);
    };

    getInstance = () => {
        return this.magic;
    };

    login = async (email: string) => {
        if (this.magic) {
            try {
                const didToken = await this.magic.auth.loginWithEmailOTP({
                    email,
                });

                return didToken;
            } catch (error) {
                throw error;
            }
        } else {
            console.log("magic isn't available", this.magic);
        }
    };

    logout = async () => {
        if (this.magic) {
            await this.magic.user.logout();
        }
    };

    getUserInfo = async () => {
        const address = await this.getUserAddress();
        return {
            address,
        };
    };

    isLoggedIn = () => {
        return this.magic?.user.isLoggedIn();
    };

    getUserAddress = async () => {
        const user = await this.magic?.user.getInfo();

        return user?.publicAddress;
    };

    signTransaction = async (transaction: Transaction): Promise<string> => {
        if (this.magic) {
            try {
                const signedTx =
                    await this.magic.solana.signTransaction(transaction);

                return Transaction.from(signedTx.rawTransaction)
                    .serialize({
                        requireAllSignatures: false,
                    })
                    .toString("base64");
            } catch (error) {
                return error as string;
            }
        }

        return "";
    };
}
