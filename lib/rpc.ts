"use client";

import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import { CustomChainConfig, SafeEventEmitterProvider } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";

export class RPC {
    private provider: SafeEventEmitterProvider;

    constructor(provider: SafeEventEmitterProvider) {
        this.provider = provider;
    }

    getAccounts = async (): Promise<string[]> => {
        try {
            const solanaWallet = new SolanaWallet(this.provider);
            const acc = await solanaWallet.requestAccounts();

            return acc;
        } catch (error) {
            return error as string[];
        }
    };

    getBalance = async (): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(this.provider);
            const connectionConfig =
                await solanaWallet.request<CustomChainConfig>({
                    method: "solana_provider_config",
                    params: [],
                });
            const conn = new Connection(connectionConfig.rpcTarget);

            const accounts = await solanaWallet.requestAccounts();
            const balance = await conn.getBalance(new PublicKey(accounts[0]));

            return (balance / 10 ** 9).toString();
        } catch (error) {
            return error as string;
        }
    };

    signMessage = async (): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(this.provider);
            const msg = Buffer.from("Test Signing Message ", "utf8");
            const res = await solanaWallet.signMessage(msg);

            return res.toString();
        } catch (error) {
            return error as string;
        }
    };

    sendTransaction = async (transaction: Transaction): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(this.provider);

            // const accounts = await solanaWallet.requestAccounts();

            // const connectionConfig =
            //     await solanaWallet.request<CustomChainConfig>({
            //         method: "solana_provider_config",
            //         params: [],
            //     });
            // const connection = new Connection(connectionConfig.rpcTarget);

            // const block = await connection.getLatestBlockhash("finalized");

            // const TransactionInstruction = SystemProgram.transfer({
            //     fromPubkey: new PublicKey(accounts[0]),
            //     toPubkey: new PublicKey(accounts[0]),
            //     lamports: 0.01 * LAMPORTS_PER_SOL,
            // });

            // const transaction = new Transaction({
            //     blockhash: block.blockhash,
            //     lastValidBlockHeight: block.lastValidBlockHeight,
            //     feePayer: new PublicKey(accounts[0]),
            // }).add(transactionInstruction);

            const { signature } = await solanaWallet.signAndSendTransaction(
                transaction
            );

            return signature;
        } catch (error) {
            return error as string;
        }
    };

    signTransaction = async (transaction: Transaction): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(this.provider);

            const signedTx = await solanaWallet.signTransaction(transaction);

            return signedTx
                .serialize({
                    requireAllSignatures: false,
                })
                .toString("base64");
        } catch (error) {
            return error as string;
        }
    };

    getPrivateKey = async (): Promise<string> => {
        const privateKey = await this.provider.request({
            method: "solanaPrivateKey",
        });

        return privateKey as string;
    };
}
