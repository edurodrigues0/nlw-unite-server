export function generateSlug(title: string) {
  const slug = title.toLocaleLowerCase().replace(/\s+/g, '-')
  
  return slug
}