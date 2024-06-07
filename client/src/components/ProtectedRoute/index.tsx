import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { useAccount } from "store/account";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const account = useAccount();
  if (account.id === undefined) {
    return redirect("/login");
  }

  return children;
}
