import { PADEL_TOKEN, PADEL_TOKEN_VALUE } from "@/lib/constants";
import { cn, formatDate, formatValue, trimWalletAddress } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export type Transfer = {
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

type ParsedTransaction = {
    dateUTC: string;
    timestamp: number;
    fromUserAccount: string;
    toUserAccount: string;
    tokenAmount: number;
    mint: string;
};

type TransactionProps = {
    accountAddress: string;
    tx: ParsedTransaction;
};

function Transaction({ accountAddress, tx }: TransactionProps) {
    let txSign = "+";
    let account = tx.fromUserAccount;

    if (tx.fromUserAccount === accountAddress) {
        txSign = "-";
        account = tx.toUserAccount;
    }

    return (
        <Sheet>
            <SheetTrigger>
                <div className="flex items-center p-4">
                    <div className="flex flex-col gap-1 grow text-left">
                        <p className="text-sm font-medium leading-none">
                            {trimWalletAddress(account)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formatDate(tx.dateUTC)}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                        <p className={"text-md font-medium leading-none"}>
                            {`${txSign}$${formatValue(tx.tokenAmount)}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            ~ $
                            {`${formatValue(
                                tx.tokenAmount * PADEL_TOKEN_VALUE
                            )}`}{" "}
                            USDC
                        </p>
                    </div>
                </div>
            </SheetTrigger>
            <SheetContent side="bottom">
                <SheetHeader>
                    <SheetTitle className="text-left">
                        Transaction details
                    </SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex flex-col gap-1 grow text-left">
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm font-medium leading-none">
                            {formatDate(tx.dateUTC, "long")}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 grow text-left">
                        <p className="text-xs text-muted-foreground">
                            Sender account
                        </p>
                        <p className="text-sm font-medium leading-none">
                            {trimWalletAddress(tx.fromUserAccount, 15)}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 grow text-left">
                        <p className="text-xs text-muted-foreground">
                            Receiver account
                        </p>
                        <p className="text-sm font-medium leading-none">
                            {trimWalletAddress(tx.toUserAccount, 15)}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 grow text-left">
                        <p className="text-xs text-muted-foreground">
                            Amount (PADEL)
                        </p>
                        <p className="text-sm font-medium leading-none">
                            ${formatValue(tx.tokenAmount)}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 grow text-left">
                        <p className="text-xs text-muted-foreground">
                            Amount (USDC)
                        </p>
                        <p className="text-sm font-medium leading-none">
                            ~${formatValue(tx.tokenAmount * PADEL_TOKEN_VALUE)}
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

type TransactionsProps = {
    accountAddress: string;
    data: Promise<Transactions>;
};

export async function Transactions({
    accountAddress,
    data,
}: TransactionsProps) {
    const {
        account: { transactions },
    } = await data;

    const padelTxs = transactions
        .map<ParsedTransaction | null>((tx) => {
            const padelTx = tx.tokenTransfers.find(
                (tx) => tx.mint === PADEL_TOKEN
            );

            if (padelTx) {
                return {
                    ...padelTx,
                    tokenAmount: parseFloat(padelTx.tokenAmount),
                    timestamp: tx.timestamp,
                    dateUTC: tx.dateUTC,
                };
            }

            return null;
        })
        .filter(Boolean) as Array<ParsedTransaction>;

    if (padelTxs.length === 0) {
        return <p>No transactions</p>;
    }

    return (
        <div className="flex flex-col divide-y">
            {padelTxs.map((tx) => (
                <Transaction
                    accountAddress={accountAddress}
                    tx={tx}
                    key={tx.timestamp}
                />
            ))}
        </div>
    );
}
