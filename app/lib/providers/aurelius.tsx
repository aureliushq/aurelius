import { ReactNode, Suspense, createContext } from 'react'
import { Timer, useTimer } from 'react-use-precision-timer'

import { useQuery } from '@evolu/react'
import LoadingScreen from '~/components/common/loading-screen'
import { SettingsRow, settingsQuery } from '~/services/evolu/client'

export type AureliusProviderData = {
	sessionTimer: Timer
	settings: SettingsRow
}

export const AureliusContext = createContext<AureliusProviderData>({
	// @ts-expect-error: tradeoff between having this comment in multiple places or one place
	sessionTimer: null,
	// @ts-expect-error: tradeoff between having this comment in multiple places or one place
	settings: null,
})

type AureliusProviderProps = {
	children: ReactNode
}

const AureliusProvider = ({ children }: AureliusProviderProps) => {
	const { rows: settings } = useQuery(settingsQuery)
	const sessionTimer = useTimer()

	const data: AureliusProviderData = {
		sessionTimer,
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
