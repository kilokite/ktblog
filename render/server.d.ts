import type { SiteConfig } from '@server/lib/site-config-schema';

export declare function solid_render(fetchFn: typeof globalThis.fetch, url: string, siteConfig?: SiteConfig): Promise<string>;
export declare function generateHydrationScript(options?: { eventNames?: string[]; nonce?: string }): string;
