import type { RouteSectionProps } from "@solidjs/router";
import { useLocation } from "@solidjs/router";
import { createMemo, Suspense, type ParentProps } from "solid-js";
import { isServer } from "solid-js/web";
import { Transition } from "solid-transition-group";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { getLayoutConfig } from "./lib/layoutConfig";
import { useSiteConfig } from "./lib/site-config";
import "./App.scss";

function HeroSection() {
	const siteConfig = useSiteConfig();
	const hero = createMemo(() => siteConfig().renderUi.hero);
	const accentIndex = createMemo(() =>
		hero().accentText ? hero().title.indexOf(hero().accentText) : -1,
	);

	return (
		<section class="hero">
			<img class="hero-bg" src={hero().backgroundUrl} alt="" />
			<div class="hero-overlay">
				<div class="hero-title">
					<h1>
						{accentIndex() === -1 ? (
							hero().title
						) : (
							<>
								{hero().title.slice(0, accentIndex())}
								<span
									class="hero-title-accent"
									style={{ color: hero().accentColor }}
								>
									{hero().title.slice(accentIndex(), accentIndex() + hero().accentText.length)}
								</span>
								{hero().title.slice(accentIndex() + hero().accentText.length)}
							</>
						)}
					</h1>
					<p>{hero().subtitle}</p>
				</div>
			</div>
		</section>
	);
}

function PageContent(props: ParentProps) {
	return (
		<div class="page-content">
			<Suspense>
				{isServer ? (
					props.children
				) : (
					<Transition name="fade" mode="outin">
						{props.children}
					</Transition>
				)}
			</Suspense>
		</div>
	);
}

export default function App(props: RouteSectionProps) {
	const location = useLocation();
	const config = createMemo(() => getLayoutConfig(location.pathname));

	return (
		<div class={config().className}>
			<NavBar />
			<HeroSection />
			<PageContent>{props.children}</PageContent>
			<Footer />
		</div>
	);
}
