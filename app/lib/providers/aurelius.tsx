import { ReactNode, createContext } from 'react'

import { SettingsRow } from '~/services/evolu/client'

export type AureliusProviderData = {
	settings: SettingsRow
}

export const AureliusContext = createContext<AureliusProviderData>({
	// @ts-expect-error: tradeoff between having this comment in multiple places or one place
	settings: null,
})

type AureliusProviderProps = {
	children: ReactNode
	data: AureliusProviderData
}

const AureliusProvider = ({ children, data }: AureliusProviderProps) => {
	return (
		<AureliusContext.Provider value={data}>
			{children}
		</AureliusContext.Provider>
	)
}

export default AureliusProvider
