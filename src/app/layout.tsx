import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif, VT323 } from 'next/font/google';
import Cursor from '@/components/Cursor';
import { IntroProvider } from '@/components/IntroProvider';
import LoadingScreen from '@/components/LoadingScreen';
import Nav from '@/components/Nav';
import PageLoader from '@/components/PageLoader';
import RevealScope from '@/components/RevealScope';
import SmoothScroll from '@/components/SmoothScroll';
import { site } from '@/content/site';
import './globals.css';

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif' });
const sans = Geist({ subsets: ['latin'], variable: '--font-sans' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });
const crt = VT323({ subsets: ['latin'], weight: '400', variable: '--font-crt' });

export const metadata: Metadata = {
  title: { default: `${site.name} — Portfolio`, template: `%s · ${site.name}` },
  description: site.headline,
};

export const viewport: Viewport = {
  themeColor: '#0f0f0e',
};

/**
 * Runs before first paint and decides which loader covers the page:
 * the CRT boot on the first homepage visit of a session, the quick branded
 * curtain everywhere else. Without JS neither class is set and the page
 * simply shows.
 */
const boot = `(function(){var d=document.documentElement;try{var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;var seen=sessionStorage.getItem('mz-crt');d.classList.add(location.pathname==='/'&&!seen&&!rm?'intro-pending':'page-pending')}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable} ${crt.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <IntroProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SmoothScroll />
          <Nav />
          <div id="shell">
            <RevealScope>
              <main id="main">{children}</main>
            </RevealScope>
          </div>
          <LoadingScreen />
          <PageLoader />
          <Cursor />
        </IntroProvider>
      </body>
    </html>
  );
}
