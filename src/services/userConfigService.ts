import { eq } from "drizzle-orm";
import { db } from "../database";
import { Account, users } from "../database/schemas";
import { getSelectedAccountByUserId } from "./accountService";

export const getSelectedAccount = async (userId: number): Promise<Account | null> => {
    const account = await getSelectedAccountByUserId(userId);
    
    if (!account) { return null }

    return account
}

// actualiza el id de la cuenta seleccionada
export const updateSelectedAccount = async (userId: number, accountId: number) => {
    await db.update(users).set({ accountSelectedId: accountId }).where(eq(users.id, userId));
}
