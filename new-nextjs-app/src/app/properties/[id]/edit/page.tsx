"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProperties } from "@/contexts/PropertiesContext";
import AddPropertyForm from "@/app/properties/add/page";

// Simple edit wrapper that loads the property and passes initial values to the add form
export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getProperty, property, updateProperty, loading } = useProperties() as any;
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (params?.id) {
      getProperty(params.id).then((p: any) => {
        if (p) setInitialValues(p);
      }).catch(() => {
        router.push("/properties");
      });
    }
  }, [params?.id]);

  if (!params?.id) return null;

  // We reuse the add page component; it internally calls addProperty.
  // To keep changes minimal, we trigger updateProperty after submit via a prop.
  return (
    <AddPropertyForm __editMode initialValues={initialValues} onSubmitEdit={(values: any) => updateProperty(params.id, values)} />
  );
}