import { useCallback, useEffect, useRef, useState } from 'react'

import { EditorData } from '~/lib/types'

export type SetEditorDataFunction = (data: Partial<EditorData>) => void

type AutoSaveProps = {
	initialData: EditorData
	onSave: (data: EditorData) => Promise<void> | void
	interval?: number
	debounce?: number
}

function useAutoSave({
	initialData,
	onSave,
	interval = 60000,
	debounce = 1000,
}: AutoSaveProps): [EditorData, SetEditorDataFunction] {
	const dataRef = useRef<EditorData>(initialData)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const previousDataRef = useRef<EditorData>(initialData)

	const [data, setDataState] = useState<EditorData>(initialData)

	const setData: SetEditorDataFunction = useCallback((newData) => {
		setDataState((prevData) => {
			const updatedData = { ...prevData, ...newData }
			dataRef.current = updatedData
			debouncedSave()
			return updatedData
		})
	}, [])

	const debouncedSave = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		timeoutRef.current = setTimeout(() => {
			if (
				JSON.stringify(dataRef.current) !==
				JSON.stringify(previousDataRef.current)
			) {
				onSave(dataRef.current)
				previousDataRef.current = { ...dataRef.current }
			}
		}, debounce)
	}, [onSave, debounce])

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (
				JSON.stringify(dataRef.current) !==
				JSON.stringify(previousDataRef.current)
			) {
				onSave(dataRef.current)
				previousDataRef.current = { ...dataRef.current }
			}
		}, interval)

		return () => {
			clearInterval(intervalId)
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [onSave, interval])

	return [data, setData]
}

export default useAutoSave
