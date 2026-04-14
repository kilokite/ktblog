import { For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { useSiteConfig } from '../lib/site-config'
import './Footer.scss'

export default function Footer() {
	const siteConfig = useSiteConfig()

	return (
		<footer class="site-footer">
			<div class="footer-inner">
				<div class="footer-brand">
					<span class="footer-brand-name">{siteConfig().siteName}</span>
				</div>
				<div class="footer-content">
					<nav class="footer-links">
						<For each={siteConfig().renderUi.footer.links}>
							{(link) => (
								<A href={link.href} class="footer-link">
									{link.label}
								</A>
							)}
						</For>
					</nav>
					<Show when={siteConfig().footerText}>
						<p class="footer-text">{siteConfig().footerText}</p>
					</Show>
				</div>
			</div>
		</footer>
	)
}
