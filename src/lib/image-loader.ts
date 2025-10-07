/**
 * Custom image loader for static export
 * Handles image optimization for static builds
 */
export default function imageLoader({ src, width, quality }: {
  src: string
  width: number
  quality?: number
}) {
  // For static export, return the image as-is
  // In production, this would be handled by CDN
  const params = new URLSearchParams()
  
  if (width) {
    params.set('w', width.toString())
  }
  
  if (quality) {
    params.set('q', quality.toString())
  }
  
  // Handle different image sources
  if (src.startsWith('http') || src.startsWith('https')) {
    // External images - proxy through our image optimization API
    return `/api/image-proxy?url=${encodeURIComponent(src)}&${params}`
  }
  
  // Local images - return as-is for static export
  return src
}