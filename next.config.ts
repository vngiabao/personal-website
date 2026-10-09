import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  turbopack: { root: process.cwd() },
  // HTTPS/host redirects belong at the hosting edge. Its origin connection
  // can be HTTP even when the visitor is on HTTPS, causing a redirect loop.
  headers() {
    return [{
      source: '/fonts/:path*',
      // Fonts remain crawlable for rendering, but are not search results.
      headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
    }];
  },
};
export default config;
