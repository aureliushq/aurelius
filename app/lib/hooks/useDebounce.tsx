import { useCallback, useRef } from 'react'

type DebouncedFunction<T extends any[]> = (...args: T) => void

function useDebounce<T extends any[]>(
	func: (...args: T) => void,
	delay: number
): DebouncedFunction<T> {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	return useCallback(
		(...args: T) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
			timeoutRef.current = setTimeout(() => {
				func(...args)
			}, delay)
		},
		[func, delay]
	)
}

export default useDebounce
