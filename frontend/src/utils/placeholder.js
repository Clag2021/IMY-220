export const PLACEHOLDER_IMAGES = [
  "/placeholder.jpg",
  "/placeholder2.jpg",
];

export function getRandomPlaceholder() {
  const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
  return PLACEHOLDER_IMAGES[randomIndex];
}