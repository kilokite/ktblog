export interface LayoutConfig {
	className: string;
}

const LAYOUT_CONFIGS: Record<string, LayoutConfig> = {
	"/":           { className: "layout-default" },
	"/post/:slug": { className: "layout-detail" },
	"/archive":    { className: "layout-default" },
	"/profile":    { className: "layout-profile" },
};

const DEFAULT_CONFIG: LayoutConfig = { className: "layout-default" };

export function getLayoutConfig(pathname: string): LayoutConfig {
	if (pathname in LAYOUT_CONFIGS) return LAYOUT_CONFIGS[pathname];
	if (pathname.startsWith("/post/")) return LAYOUT_CONFIGS["/post/:slug"];
	return DEFAULT_CONFIG;
}
