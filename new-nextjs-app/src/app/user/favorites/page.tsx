import dynamicImport from 'next/dynamic';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

// Dynamically import the component to prevent SSR issues
const FavoritesClient = dynamicImport(() => import('./FavoritesClient'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function FavoritesPage() {
  return <FavoritesClient />;
}