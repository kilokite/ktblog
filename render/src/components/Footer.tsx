import { createResource, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { useApi } from '../lib/api'
import './Footer.scss'

export default function Footer() {
	const api = useApi()
	const [config] = createResource(async () => {
		const res = await api['site-config'].$get()
		if (!res.ok) return null
		return res.json()
	})

	return (
		<footer class="site-footer">
			<div class="footer-inner">
				<div class="footer-brand">
					<span class="footer-brand-name">{config()?.siteName || 'KtBlog'}</span>
				</div>
				<div class="footer-content">
					<nav class="footer-links">
						<A href="/" class="footer-link">随便看看</A>
						<A href="/" class="footer-link">站点地图</A>
						<A href="/" class="footer-link">友情链接</A>
						<A href="/archive" class="footer-link">归档</A>
					</nav>
					<Show when={config()?.footerText}>
						<p class="footer-text">{config()!.footerText}</p>
					</Show>
				</div>
			</div>
		</footer>
	)
}
