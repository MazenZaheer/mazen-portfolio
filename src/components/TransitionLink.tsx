'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AnchorHTMLAttributes, MouseEvent, Ref } from 'react';
import { scrollToTarget } from '@/lib/scroll';
import { useIntro } from './IntroProvider';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; ref?: Ref<HTMLAnchorElement> };

/**
 * Internal link that plays the branded page loader before navigating.
 * Same-page hash links just smooth-scroll.
 */
export default function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const { navigate } = useIntro();
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;
    e.preventDefault();
    if (url.pathname === pathname) {
      if (url.hash) scrollToTarget(url.hash);
      else scrollToTarget(0);
      return;
    }
    navigate(url.pathname + url.search + url.hash);
  };

  return (
    <Link href={href} scroll={false} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
