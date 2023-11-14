import Link from "next/link";

import { PADEL_TOKEN } from "@/lib/constants";
import {
    formatAdjustedValue,
    formatDate,
    formatValue,
    trimWalletAddress,
} from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export type Transfer = {
    signature: string;
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
        tokenAmountUSD: string;
        mint: string;
    }>;
};

export type Transactions = {
    account: {
        transactions: Array<Transfer>;
    };
};

type ParsedTransaction = {
    signature: string;
    dateUTC: string;
    timestamp: number;
    fromUserAccount: string;
    toUserAccount: string;
    tokenAmount: number;
    tokenAmountUSD: number;
    mint: string;
};

type TransactionProps = {
    accountAddress: string;
    tx: ParsedTransaction;
};

function Transaction({ accountAddress, tx }: TransactionProps) {
    let txSign = "";
    let extraClass = "";
    let account = tx.toUserAccount;

    if (tx.toUserAccount === accountAddress) {
        txSign = "+";
        extraClass = "text-teal-500";
        account = tx.fromUserAccount;
    }

    return (
        <Sheet>
            <SheetTrigger>
                <h3 className="text-md py-2 text-left font-bold text-muted-foreground">
                    Today
                </h3>
                <div className="flex items-center py-4">
                    <div className="flex grow flex-row items-center gap-2 text-left">
                        <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[0.6rem]">
                                {account.substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium leading-none">
                            {trimWalletAddress(account)}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                        <p
                            className={`text-lg font-medium leading-none ${extraClass}`}
                        >
                            {`${txSign}$${formatValue(tx.tokenAmountUSD)}`}
                        </p>
                    </div>
                </div>
            </SheetTrigger>
            <SheetContent side="bottom">
                <SheetHeader className="text-left">
                    <SheetTitle className="text-teal-500">
                        Transaction details
                    </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-4">
                    <div className="flex grow flex-col gap-1 text-left">
                        <p className="text-xs text-muted-foreground">
                            Signature
                        </p>
                        <p className="text-sm font-medium leading-none">
                            <Link
                                href={`https://xray.helius.xyz/tx/${tx.signature}`}
                                target="_blank"
                            >
                                {trimWalletAddress(tx.signature, 15)}
                            </Link>
                        </p>
                    </div>
                    <div className="flex grow flex-col gap-1 text-left">
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm font-medium leading-none">
                            {formatDate(tx.dateUTC, "long")}
                        </p>
                    </div>
                    <div className="flex grow flex-col gap-1 text-left">
                        <p className="text-xs text-muted-foreground">
                            Sender account
                        </p>
                        <p className="text-sm font-medium leading-none">
                            {trimWalletAddress(tx.fromUserAccount, 15)}
                        </p>
                    </div>
                    <div className="flex grow flex-col gap-1 text-left">
                        <p className="text-xs text-muted-foreground">
                            Receiver account
                        </p>
                        <p className="text-sm font-medium leading-none">
                            {trimWalletAddress(tx.toUserAccount, 15)}
                        </p>
                    </div>
                    <div className="flex grow flex-col gap-1 text-left">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-sm font-medium leading-none">
                            {formatAdjustedValue(tx.tokenAmount)} PADEL
                        </p>
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button className="w-full">Close</Button>
                    </SheetClose>
                </SheetFooter>
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
                    signature: tx.signature,
                    tokenAmount: parseFloat(padelTx.tokenAmount),
                    tokenAmountUSD: parseFloat(padelTx.tokenAmountUSD),
                    timestamp: tx.timestamp,
                    dateUTC: tx.dateUTC,
                };
            }

            return null;
        })
        .filter(Boolean) as Array<ParsedTransaction>;

    if (padelTxs.length === 0) {
        return <p className="p-4">No transactions</p>;
    }

    return (
        <div className="flex flex-col">
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
