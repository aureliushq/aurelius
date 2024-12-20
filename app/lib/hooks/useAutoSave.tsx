import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'

import type { EditorData } from '~/lib/types'

type SetEditorDataOptions = {
	ignoreAutoSave?: boolean
}

export type SetEditorDataFunction = (
	data: Partial<EditorData>,
	options?: SetEditorDataOptions,
) => void

type AutoSaveProps = {
	initialData: EditorData
	onAutoSave: (data: EditorData) => Promise<void> | void
	interval?: number
	debounce?: number
}

const useAutoSave = ({
	initialData,
	onAutoSave,
	interval = 60000,
	debounce = 1000,
}: AutoSaveProps): [EditorData, SetEditorDataFunction, () => void] => {
	const dataRef = useRef<EditorData>(initialData)
	const ignoreAutoSaveFieldsRef = useRef<Set<string>>(new Set())
	const isInitialMountRef = useRef(true)
	const onAutoSaveRef = useRef(onAutoSave)
	const previousDataRef = useRef<EditorData>(initialData)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	const [data, setDataState] = useState<EditorData>(initialData)

	const debouncedSave = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		timeoutRef.current = setTimeout(() => {
			const dataToSave = { ...dataRef.current }
			for (const key of ignoreAutoSaveFieldsRef.current) {
				dataToSave[key] = previousDataRef.current[key]
			}

			if (
				JSON.stringify(dataToSave) !==
				JSON.stringify(previousDataRef.current)
			) {
				onAutoSaveRef.current(dataToSave)
				previousDataRef.current = { ...dataToSave }
			}
		}, debounce)
	}, [debounce])

	const setData: SetEditorDataFunction = useCallback(
		(newData, options = {}) => {
			const { ignoreAutoSave = false } = options

			if (isInitialMountRef.current) {
				dataRef.current = { ...dataRef.current, ...newData }
				if (ignoreAutoSave) {
					for (const key of Object.keys(newData)) {
						ignoreAutoSaveFieldsRef.current.add(key)
					}
				}
			} else {
				setDataState((prevData) => {
					const updatedData = { ...prevData, ...newData }
					dataRef.current = updatedData

					if (ignoreAutoSave) {
						for (const key of Object.keys(newData)) {
							ignoreAutoSaveFieldsRef.current.add(key)
						}
					} else {
						for (const key of Object.keys(newData)) {
							ignoreAutoSaveFieldsRef.current.delete(key)
						}
					}

					const shouldAutoSave = Object.keys(newData).some(
						(key) => !ignoreAutoSaveFieldsRef.current.has(key),
					)

					if (shouldAutoSave) {
						debouncedSave()
					}

					return updatedData
				})
			}
		},
		[debouncedSave],
	)

	const forceSave = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		if (
			JSON.stringify(dataRef.current) !==
			JSON.stringify(previousDataRef.current)
		) {
			onAutoSaveRef.current(dataRef.current)
			previousDataRef.current = { ...dataRef.current }
		}

		// reset all ignore flags
		ignoreAutoSaveFieldsRef.current.clear()
	}, [])

	useEffect(() => {
		onAutoSaveRef.current = onAutoSave
	}, [onAutoSave])

	useEffect(() => {
		const intervalId = setInterval(() => {
			const dataToSave = { ...dataRef.current }
			for (const key of ignoreAutoSaveFieldsRef.current) {
				dataToSave[key] = previousDataRef.current[key]
			}
			if (
				JSON.stringify(dataToSave) !==
				JSON.stringify(previousDataRef.current)
			) {
				onAutoSaveRef.current(dataToSave)
				previousDataRef.current = { ...dataToSave }
			}
		}, interval)

		return () => {
			clearInterval(intervalId)
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [interval])

	useLayoutEffect(() => {
		onAutoSaveRef.current = onAutoSave
		isInitialMountRef.current = false
	}, [onAutoSave])

	return [data, setData, forceSave]
}

export default useAutoSave
