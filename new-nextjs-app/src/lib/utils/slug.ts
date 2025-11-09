/**
 * Generate a URL-friendly slug from a title
 * @param title - The title to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(title: string): string {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Get slug from a property or project object
 * Falls back to generating from title if slug doesn't exist
 */
export function getSlug(item: { slug?: string; title?: string; name?: string }): string {
  if (item.slug) {
    return item.slug;
  }
  
  const title = item.title || item.name || '';
  return generateSlug(title);
}

