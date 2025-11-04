import dynamic from 'next/dynamic';

const dynamicImport = (importFunc: () => Promise<any>) => dynamic(importFunc, {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export const dynamic = 'force-dynamic';

// Dynamically import the component to prevent SSR issues
const ProjectFavoritesClient = dynamicImport(() => import('./ProjectFavoritesClient'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function ProjectFavoritesPage() {
  return <ProjectFavoritesClient />;
}
