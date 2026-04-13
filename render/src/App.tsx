import type { RouteSectionProps } from "@solidjs/router";
import { Suspense, type ParentProps } from "solid-js";
import { isServer } from "solid-js/web";
import { Transition } from "solid-transition-group";
import NavBar from "./components/NavBar";
import { HERO_IMG } from "./lib/constants";
import { LayoutConfigProvider, useLayoutConfig } from "./lib/layoutConfig";
import "./App.scss";

function HeroSection() {
	const { titleHeight } = useLayoutConfig();

	return (
		<section class="hero">
			<img class="hero-bg" src={HERO_IMG} alt="" />
			<div class="hero-overlay">
				<div class="hero-title" style={{ height: `${titleHeight()}px` }}>
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
	const { overlap } = useLayoutConfig();

	return (
		<div class="page-content" style={{ "margin-top": `-${overlap()}px` }}>
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
	return (
		<LayoutConfigProvider>
			<NavBar />
			<HeroSection />
			<PageContent>{props.children}</PageContent>
		</LayoutConfigProvider>
	);
}
