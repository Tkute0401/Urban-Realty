"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddPropertyShallow() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the properties/add page
    router.replace("/properties/add");
  }, [router]);

  return null;
}