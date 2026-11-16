import './globals.css';
import Header from '@/components/Header';
import StickyCta from '@/components/StickyCta';
import ButtonFx from '@/components/ButtonFx';
import Tilt from '@/components/Tilt';
import CommandPalette from '@/components/CommandPalette';
import { Footer } from '@/components/Sections';

const SITE = process.env.SITE_URL || 'http://localhost:3000';
const DESC = '1:1 mentoring that takes a teenager from an idea to a working full-stack app using no-code tools. 100+ students mentored.';

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'Tactyqal Labs | Real apps, built by teenagers, launched in 8 weeks', template: '%s | Tactyqal Labs' },
  description: DESC,
  openGraph: { title: 'Tactyqal Labs: build and launch a real app in 8 weeks', description: DESC, type: 'website', siteName: 'Tactyqal Labs' },
};
export const viewport = { themeColor: '#0B2D22', colorScheme: 'light dark', viewportFit: 'cover' };

const THEME_INIT = "try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){}";
const ORG = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Tactyqal Labs', url: SITE, email: 'tactyqal.labs@gmail.com', telephone: '+91-98047-72106', logo: `${SITE}/icon.svg`, description: DESC };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body><a className="skip" href="#top">Skip to content</a><Header /><main id="top">{children}</main><Footer /><StickyCta /><ButtonFx /><Tilt /><CommandPalette /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG).replace(/</g, '\\u003c') }} /></body>
    </html>
  );
}
