"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import MultistepForm from "../components/MultistepForm";

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem("user");

  if (!user && !userSession) {
    router.push("/sign-in");
  }

  return (
    <div>
      <button
        onClick={() => {
          signOut(auth);
          sessionStorage.removeItem("user");
        }}
      >
        Log out
      </button>

      <MultistepForm />
    </div>
  );
}
