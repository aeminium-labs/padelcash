import { Transaction } from "@solana/web3.js";
import { CustomChainConfig, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
    LOGIN_PROVIDER_TYPE,
    OpenloginAdapter,
} from "@web3auth/openlogin-adapter";
import {
    SolanaPrivateKeyProvider,
    SolanaWallet,
} from "@web3auth/solana-provider";

import { getAppUrl } from "@/lib/utils";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_KEY;
const url = getAppUrl();

export class Auth {
    private web3auth: Web3AuthNoModal;
    provider: IProvider | null;

    constructor(chainConfig: CustomChainConfig) {
        if (clientId) {
            this.web3auth = new Web3AuthNoModal({
                clientId,
                chainConfig,
                web3AuthNetwork: "sapphire_mainnet",
            });

            const privateKeyProvider = new SolanaPrivateKeyProvider({
                config: { chainConfig },
            });

            const openloginAdapter = new OpenloginAdapter({
                privateKeyProvider,
                adapterSettings: {
                    uxMode: "redirect",
                    replaceUrlOnRedirect: false,
                    redirectUrl: `${url}/account?firstTime=true`,
                },
            });

            this.web3auth.configureAdapter(openloginAdapter);
        }
    }

    init = async () => {
        await this.web3auth.init();
    };

    getInstance = () => {
        return this.web3auth;
    };

    login = async (
        provider: LOGIN_PROVIDER_TYPE | undefined = "email_passwordless",
        options: Record<string, string> | undefined = {}
    ) => {
        await this.web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider: provider,
            extraLoginOptions: options,
        });
    };

    logout = async () => {
        await this.web3auth.logout();
    };

    getUserInfo = async () => {
        const address = await this.getUserAddress();
        return {
            address,
        };
    };

    isLoggedIn = () => {
        return this.web3auth.status === "connected";
    };

    getUserAddress = async () => {
        if (this.web3auth.provider) {
            const solanaWallet = new SolanaWallet(this.web3auth.provider);
            const accounts = await solanaWallet.requestAccounts();

            return accounts[0];
        }

        return null;
    };

    signTransaction = async (transaction: Transaction): Promise<string> => {
        const provider = this.web3auth.provider;

        if (provider) {
            try {
                const solanaWallet = new SolanaWallet(provider);

                const signedTx =
                    await solanaWallet.signTransaction(transaction);

                return signedTx
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
