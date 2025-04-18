"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    signOut()
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Logout fehlgeschlagen:", error);
      });
  });
}
