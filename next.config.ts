import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  turbopack: { root: process.cwd() },
  redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.gbaonvo.com' }],
        destination: 'https://gbaonvo.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          { type: 'host', value: 'gbaonvo.com' },
          { type: 'header', key: 'x-forwarded-proto', value: 'http' },
        ],
        destination: 'https://gbaonvo.com/:path*',
        permanent: true,
      },
    ];
  },
  headers() {
    return [{
      source: '/fonts/:path*',
      // Fonts remain crawlable for rendering, but are not search results.
      headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
    }];
  },
};
export default config;
