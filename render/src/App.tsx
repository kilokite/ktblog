import type { RouteSectionProps } from "@solidjs/router";
import { useLocation } from "@solidjs/router";
import { createMemo, Suspense, type ParentProps } from "solid-js";
import { isServer } from "solid-js/web";
import { Transition } from "solid-transition-group";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { HERO_IMG } from "./lib/constants";
import { getLayoutConfig } from "./lib/layoutConfig";
import "./App.scss";

function HeroSection() {
	return (
		<section class="hero">
			<img class="hero-bg" src={HERO_IMG} alt="" />
			<div class="hero-overlay">
				<div class="hero-title">
					<h1>
						Kilokite Bl<span class="hero-title-accent">o</span>g
					</h1>
					<p>后来喝中药调好了</p>
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
