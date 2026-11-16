import nextVitals from 'eslint-config-next/core-web-vitals';

export default [
  ...nextVitals,
  {
    rules: {
      // Images use a best-quality-first source list with fallbacks (see Media.jsx), which next/image cannot express for remote hosts.
      '@next/next/no-img-element': 'off',
      // App Router: the root layout is the document head, so the font <link> tags in layout.jsx apply to every page.
      '@next/next/no-page-custom-font': 'off',
    },
  },
  { ignores: ['.next/**', 'node_modules/**', 'public/**'] },
];
