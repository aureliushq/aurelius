import { ReactNode, Suspense, createContext } from 'react'

import { useQuery } from '@evolu/react'
import LoadingScreen from '~/components/common/loading-screen'
import { SettingsRow, settingsQuery } from '~/services/evolu/client'

export type AureliusProviderData = {
	settings: SettingsRow
}

export const AureliusContext = createContext<AureliusProviderData>({
	// @ts-expect-error: tradeoff between having this comment in multiple places or one place
	settings: null,
})

type AureliusProviderProps = {
	children: ReactNode
}

const AureliusProvider = ({ children }: AureliusProviderProps) => {
	const { rows: settings } = useQuery(settingsQuery)

	const data: AureliusProviderData = {
		settings: settings[0],
	}

	return (
		<Suspense fallback={<LoadingScreen />}>
			<AureliusContext.Provider value={data}>
				{children}
			</AureliusContext.Provider>
		</Suspense>
	)
}

export default AureliusProvider
