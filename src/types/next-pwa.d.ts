declare module "next-pwa" {
  import { NextConfig } from "next";

  function withPWA(config: {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    runtimeCaching?: any[];
    publicExcludes?: string[];
    buildExcludes?: string[];
    cacheStartUrl?: boolean;
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string;
    fallbacks?: {
      [key: string]: string;
    };
    cacheOnFrontEndNav?: boolean;
    subdomainPrefix?: string;
    reloadOnOnline?: boolean;
    customWorkerDir?: string;
    skipWaiting?: boolean;
    clientsClaim?: boolean;
  }): (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}
