import { db, IdentityTable, AccountTable } from "..";
import type { NewAccount, NewIdentity } from "..";

export const newUser = async (newIdentity: NewIdentity, newAccount: NewAccount) => {
  return await db.transaction(async (tx) => {
    const [identity] = await tx.insert(IdentityTable).values(newIdentity).returning();
    const [account] = await tx.insert(AccountTable).values(newAccount).returning();
    return { identity, account };
  });
};
