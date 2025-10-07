// 'use client';
// import styles from './ProductFooter.module.css';

// export default function ProductFooter() {
//   return (
//     <footer className={styles.productFooter} role="contentinfo">
//       <nav aria-label="Footer links">
//         <a href="#">Contact </a>
//         <a href="#">Privacy</a>
//         <a href="#">Terms of use</a>
//         <a href="#">Accessibility</a>
//         <a href="#">Cookie Preferences</a>
//       </nav>
//     </footer>
//   );
// }
// 'use client';
// import styles from './ProductFooter.module.css';

// type Props = {
//   id?: string;
//   className?: string;
// };

// export default function ProductFooter({ id = 'nf-footer', className }: Props) {
//   const cls = className ? `${styles.productFooter} ${className}` : styles.productFooter;

//   return (
//     <footer id={id} className={cls} role="contentinfo">
//       <nav aria-label="Footer links">
//         <a href="#">Contact </a>
//         <a href="#">Privacy</a>
//         <a href="#">Terms of use</a>
//         <a href="#">Accessibility</a>
//         <a href="#">Cookie Preferences</a>
//       </nav>
//     </footer>
//   );
// }


'use client';
import styles from './ProductFooter.module.css';

type Props = {
  id?: string;         // <- keep this so we can force #nf-footer on 404
  className?: string;
};

export default function ProductFooter({ id = 'nf-footer', className }: Props) {
  const cls = className ? `${styles.productFooter} ${className}` : styles.productFooter;

  return (
    <footer id={id} className={cls} role="contentinfo">
      <nav aria-label="Footer links">
        <a href="#">Contact </a>
        <a href="#">Privacy</a>
        <a href="#">Terms of use</a>
        <a href="#">Accessibility</a>
        <a href="#">Cookie Preferences</a>
      </nav>
    </footer>
  );
}
