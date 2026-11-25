export function photoUrl(path) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${path}`;
}
// The photo with the lowest position (the "main" photo), or undefined
export function mainPhoto(photos) {
  return [...(photos ?? [])].sort((a, b) => a.position - b.position)[0];
}
