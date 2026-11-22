import * as React from 'react'

// @ts-ignore
import { pwaAssetsHead } from 'virtual:pwa-assets/head'

// @ts-ignore
import { PWAManifest } from './PWAManifest'

export function PWAAssets() {
	return (
		<>
			{pwaAssetsHead.themeColor ? (
				<meta
					name='theme-color'
					content={pwaAssetsHead.themeColor.content}
				/>
			) : null}
			{
				// @ts-ignore
				pwaAssetsHead.links.map(({ href, ...link }) => (
					<link key={href} href={href} {...link} />
				))
			}
			<PWAManifest />
		</>
	)
}
