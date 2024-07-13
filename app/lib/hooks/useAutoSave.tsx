import { useCallback, useEffect, useRef } from 'react'

type SetDataFunction<TData> = (
	newData: TData | ((data: TData) => TData)
) => void

interface AutoSaveProps<TData> {
	data: TData
	onSave: (data: TData) => Promise<void> | void
	interval?: number
	debounce?: number
}

function useAutoSave<TData>({
	data,
	onSave,
	interval = 60000,
	debounce = 1000,
}: AutoSaveProps<TData>): [() => TData, SetDataFunction<TData>] {
	const dataRef = useRef<TData>(data)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const previousDataRef = useRef<TData>(data)

	const setData: SetDataFunction<TData> = useCallback((newData) => {
		if (typeof newData === 'function') {
			dataRef.current = (newData as (prevData: TData) => TData)(
				dataRef.current
			)
		} else {
			dataRef.current = newData
		}
		debouncedSave()
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
				previousDataRef.current = dataRef.current
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
				previousDataRef.current = dataRef.current
			}
		}, interval)

		return () => {
			clearInterval(intervalId)
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [onSave, interval])

	return [() => dataRef.current, setData]
}

export default useAutoSave
