"use client";

import {
    Connection,
    PublicKey,
    Transaction,
    VersionedTransaction,
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

    signVersionedTransaction = async (
        transaction: VersionedTransaction
    ): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(this.provider);

            const signedTx = await solanaWallet.signTransaction(transaction);

            const serializedTx = signedTx.serialize();
            const buffer = Buffer.from(
                serializedTx.buffer,
                serializedTx.byteOffset,
                serializedTx.byteLength
            );

            return buffer.toString("base64");
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
