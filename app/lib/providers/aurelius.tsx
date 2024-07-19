import { Dispatch, ReactNode, SetStateAction, createContext } from 'react'

import { SettingsRow } from '~/services/evolu/client'

const setTitle: Dispatch<SetStateAction<string>> = () => {}

export type AureliusProviderData = {
	content: string
	settings: SettingsRow
	setTitle: Dispatch<SetStateAction<string>>
	title: string
}

export const AureliusContext = createContext<AureliusProviderData>({
	content: '',
	// @ts-expect-error: tradeoff between having this comment in multiple places or one place
	settings: null,
	setTitle,
	title: '',
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
