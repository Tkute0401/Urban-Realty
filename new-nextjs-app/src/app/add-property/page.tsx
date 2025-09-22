"use client";

import dynamic from "next/dynamic";

// Reuse the existing Add Property form under /properties/add
const AddPropertyImpl = dynamic(() => import("@/app/properties/add/page"), { ssr: false });

export default function AddPropertyShallow() {
  return <AddPropertyImpl />;
}