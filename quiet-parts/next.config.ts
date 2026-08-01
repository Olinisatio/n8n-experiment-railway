import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // This app lives inside a larger repository that has its own lockfile. Next
  // would otherwise infer the repo root as the workspace root and trace the
  // whole thing into the build output.
  outputFileTracingRoot: path.join(__dirname),

  // The site is one static page plus a single POST route. Nothing here needs
  // image optimisation or rewrites, so the config stays otherwise empty on
  // purpose — every addition costs mobile Lighthouse points.
};

export default nextConfig;
