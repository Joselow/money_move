import { eq } from "drizzle-orm";
import { db } from "../database/index.js";
import { Account, users } from "../database/schemas/index.js";
import { getSelectedAccountByUserId } from "./accountService.js";

export const getSelectedAccount = async (userId: number): Promise<Account | null> => {
    const account = await getSelectedAccountByUserId(userId);
    
    if (!account) { return null }

    return account
}

// actualiza el id de la cuenta seleccionada
export const updateSelectedAccount = async (userId: number, accountId: number) => {
    await db.update(users).set({ accountSelectedId: accountId }).where(eq(users.id, userId));
}
