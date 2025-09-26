"use client";

import dynamic from "next/dynamic";

// Import the AddProperty component directly instead of using dynamic import to avoid build issues
import AddProperty from "@/app/properties/add/page";

export default function AddPropertyShallow() {
  return <AddProperty />;
}