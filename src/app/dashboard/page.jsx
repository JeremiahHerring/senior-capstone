"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem("user");

  if (!user && !userSession) {
    router.push("/sign-in");
  }
  return (
    <button
      onClick={() => {
        signOut(auth);
        sessionStorage.removeItem("user");
      }}
    >
      Log out
    </button>
  );
}
