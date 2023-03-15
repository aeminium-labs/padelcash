import { PADEL_TOKEN, USDC_TOKEN } from "@/lib/constants";
import { formatValue } from "@/lib/utils";

export type Transfer = {
    description: string;
    timestamp: number;
    dateUTC: string;
    nativeTransfers: Array<{
        fromUserAccount: string;
        toUserAccount: string;
        amount: number;
    }>;
    tokenTransfers: Array<{
        fromUserAccount: string;
        toUserAccount: string;
        tokenAmount: string;
        mint: string;
    }>;
};

export type Transactions = {
    account: {
        transactions: Array<Transfer>;
    };
};

type Props = { accountAddress: string; data: Promise<Transactions> };

function parseTransfer(tx: Transfer, address: string) {
    if (tx.tokenTransfers.length > 0) {
        const padelTx = tx.tokenTransfers.find((tx) => tx.mint === PADEL_TOKEN);
        const usdcTx = tx.tokenTransfers.find((tx) => tx.mint === USDC_TOKEN);

        if (padelTx) {
            if (padelTx.fromUserAccount === address) {
                return `Sent ${padelTx.tokenAmount} PADEL to ${padelTx.toUserAccount}`;
            } else {
                return `Received ${padelTx.tokenAmount} PADEL from ${padelTx.fromUserAccount}`;
            }
        }

        if (usdcTx) {
            if (usdcTx.fromUserAccount === address) {
                return `Sent ${usdcTx.tokenAmount} USDC to ${usdcTx.toUserAccount}`;
            } else {
                return `Received ${usdcTx.tokenAmount} USDC from ${usdcTx.fromUserAccount}`;
            }
        }
    }

    if (tx.nativeTransfers.length > 0) {
        const nativeTx = tx.nativeTransfers[0];

        if (nativeTx.fromUserAccount === address) {
            return `Sent ${formatValue(nativeTx.amount, 9)} SOL to ${
                nativeTx.toUserAccount
            }`;
        } else {
            return `Received ${formatValue(nativeTx.amount, 9)} SOL from ${
                nativeTx.fromUserAccount
            }`;
        }
    }
}

export async function Transactions({ accountAddress, data }: Props) {
    const {
        account: { transactions },
    } = await data;

    return (
        <div className="flex flex-col gap-0">
            {transactions.map((tx) => (
                <div
                    className="flex flex-row items-center justify-between gap-4 border-b border-slate-700 py-2 last:border-0"
                    key={tx.timestamp}
                >
                    <span className="text-sm">
                        {parseTransfer(tx, accountAddress)}
                    </span>
                    <span className="text-sm text-slate-400">{tx.dateUTC}</span>
                </div>
            ))}
        </div>
    );
}
