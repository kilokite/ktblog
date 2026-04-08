import type { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";
import { isServer } from "solid-js/web";
import { Transition } from "solid-transition-group";
import NavBar from "./components/NavBar";
import { HERO_IMG } from "./lib/constants";
import "./App.scss";

export default function App(props: RouteSectionProps) {
	return (
		<>
    <NavBar />
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

			<Suspense>
				{isServer ? (
					props.children
				) : (
					<Transition name="fade" mode="outin">
						{props.children}
					</Transition>
				)}
			</Suspense>
		</>
	);
}
