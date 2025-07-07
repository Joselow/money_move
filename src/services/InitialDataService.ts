import { Account } from "../database/schemas";
import { getAccountById, getFirstAccountByUserId } from "./accountService";
import { getLastTransactionByUserId } from "./transactionService"

export const getSelectedAccount = async (userId: number): Promise<Account | null> => {
    const lastTransaction = await getLastTransactionByUserId(userId);

    
    if (lastTransaction) {
        const account = await getAccountById(lastTransaction.accountId);
        return account;
    }
    
    const firstAccount = await getFirstAccountByUserId(userId);
    
    if (firstAccount) {
        return firstAccount;
    }
    
    console.log({ lastTransaction, firstAccount, userId });
    return null;
}

