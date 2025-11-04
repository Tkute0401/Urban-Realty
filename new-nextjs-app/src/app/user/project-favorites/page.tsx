import nextDynamic from 'next/dynamic';

export const dynamic = 'force-dynamic';

// Dynamically import the component to prevent SSR issues
const ProjectFavoritesClient = nextDynamic(() => import('./ProjectFavoritesClient'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function ProjectFavoritesPage() {
  return <ProjectFavoritesClient />;
}
