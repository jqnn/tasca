"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({redirectTo: "/"})
      .then()
      .catch((error) => {
        console.error("Logout fehlgeschlagen:", error);
      });
  });
}
