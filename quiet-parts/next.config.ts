import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The site is one static page plus a single POST route. Nothing here needs
  // image optimisation or rewrites, so the default config stays empty on
  // purpose — every addition costs mobile Lighthouse points.
};

export default nextConfig;
