import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const copyToClipboard = async (value: string) => {
	navigator?.clipboard?.writeText(value)
}

export const formatTime = (timestamp: number) => {
	const totalSeconds = Math.floor(timestamp / 1000)
	const hours = `${Math.floor(totalSeconds / 3600)}`.padStart(2, '0')
	const minutes = `${Math.floor((totalSeconds % 3600) / 60)}`.padStart(2, '0')
	const seconds = `${totalSeconds % 60}`.padStart(2, '0')

	return { hours, minutes, seconds }
}
