// 'use client';

// import { useTranslations } from 'next-intl';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import styles from './not-found.module.css';
// // Update the import path below to the correct location of UiShell
// // Example: import { UiShell } from '@/components/UiShell';
// import { UiShell } from '@/components/UiShell';

// export default function ContentNotFound() {
//   const t = useTranslations('content.notFound');
//   const params = useParams();
//   const locale = params.locale as string;

//   return (
//     <div className="full-page-error-stories__viewport">
//   <UiShell>
//     <div className="full-page-error-stories__offset">
//       <div className="full-page-error-stories__breadcrumb-container">
//         <Breadcrumbs className="full-page-error-stories__breadcrumb" />
//       </div>
//       <FullPageError
//         description="The page you requested has moved or is unavailable, or the specified URL is not valid. Please check the URL or search the site for the requested content."
//         kind="404"
//         label="Error 404"
//         title="Page not found"
//       >
//         <Link
//           href="/"
//           size="lg"
//         >
//           – Forwarding Link 1
//         </Link>
//         <br />
//         <Link
//           href="/"
//           size="lg"
//         >
//           – Forwarding Link 1
//         </Link>
//       </FullPageError>
//     </div>
//   </UiShell>
// </div>
//   );
// }




'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './not-found.module.css';
import { UiShell } from '@/components/UiShell';

// add these two imports:

import { FullPageError } from '@carbon/ibm-products';
import { Button } from '@carbon/react';

export default function ContentNotFound() {
  const t = useTranslations('content.notFound');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <FullPageError
      title={t('title') || 'Page not found'}
      label="Error 404"
      description={t('description') || 'The page you requested has moved or is unavailable, or the specified URL is not valid. Please check the URL or search the site for the requested content.'}
      kind="404"
    >
      <Button as={Link} href={`/${locale}`} size="lg" kind="primary">
        {t('actions.backToHome') || 'Back to Home'}
      </Button>
    </FullPageError>
  );
}
