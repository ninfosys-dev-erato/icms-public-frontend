// Renders your src/app/[locale]/not-found.tsx for any unknown path under a locale
import { notFound } from 'next/navigation';

export default function Unmatched() {
  notFound();
}
