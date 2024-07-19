import { Dispatch, ReactNode, SetStateAction, createContext } from 'react'

import { SettingsRow } from '~/services/evolu/client'

const setTitle: Dispatch<SetStateAction<string>> = () => {}

export type AureliusProviderData = {
	content: string
	settings: Partial<SettingsRow>
	setTitle: Dispatch<SetStateAction<string>>
	title: string
}

export const AureliusContext = createContext<AureliusProviderData>({
	content: '',
	settings: {},
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
