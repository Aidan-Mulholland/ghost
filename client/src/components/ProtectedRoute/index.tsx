import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import jwt from "jsonwebtoken";
import { setAccountInfo } from "store/account";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const identityToken = document.cookie
      .split(";")
      .find((cookie) => cookie.startsWith("identityToken="))
      ?.replace("identityToken=", "");
    if (!identityToken) {
      redirect("/login");
    }
    const token = jwt.decode(identityToken);
    dispatch(setAccountInfo({ ...(token as any), isLoggedIn: true }));
  }, []);

  return children;
}
