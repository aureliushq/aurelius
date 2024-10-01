import * as S from '@effect/schema/Schema'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ModifierKeys } from '~/lib/types'
import { type Arls, arls } from '~/services/arls'
import { NonEmptyString100, WritingEffortId } from '~/services/evolu/schema'

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

export const getShortcutWithModifiers = (
	key: string,
	modifiers: ModifierKeys,
) => {
	return `${Object.entries(modifiers)
		.filter(([_, active]) => active)
		.map(([mod]) => mod)
		.join('+')}+${key}`
}

export const capitalize = ({
	str,
	lower = false,
}: {
	str: string
	lower: boolean
}) =>
	(lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
		match.toUpperCase(),
	)

export const checkSlugUniqueness = async ({
	effortId,
	effortType,
	slug,
}: {
	effortId: string
	effortType: string
	slug: string
}) => {
	const table = arls[effortType as keyof Arls]
	const writing = await table.findUnique({
		effortId: S.decodeSync(WritingEffortId)(effortId),
		slug: S.decodeSync(NonEmptyString100)(slug),
	})

	if (!writing) {
		return { isUnique: true, slug }
	} else {
		return { isUnique: false, slug: '' }
	}
}

export const convertMsToHumanReadable = (ms: number): string => {
	const second: number = 1000
	const minute: number = second * 60
	const hour: number = minute * 60
	const day: number = hour * 24

	const days: number = Math.floor(ms / day)
	const hours: number = Math.floor((ms % day) / hour)
	const minutes: number = Math.floor((ms % hour) / minute)
	const seconds: number = Math.floor((ms % minute) / second)
	const milliseconds: number = ms % second

	const parts: string[] = []

	if (days > 0) {
		parts.push(`${days} day${days !== 1 ? 's' : ''}`)
	}
	if (hours > 0) {
		parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
	}
	if (minutes > 0) {
		parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
	}
	if (seconds > 0 || (milliseconds > 0 && parts.length === 0)) {
		parts.push(
			`${seconds}.${milliseconds.toString().padStart(3, '0')} second${seconds !== 1 ? 's' : ''}`,
		)
	}

	if (parts.length === 0) {
		return '0 seconds'
	} else if (parts.length === 1) {
		return parts[0]
	} else if (parts.length === 2) {
		return `${parts[0]} and ${parts[1]}`
	} else {
		return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`
	}
}
