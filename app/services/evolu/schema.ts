import * as S from '@effect/schema/Schema'
import {
	PositiveInt,
	SqliteBoolean,
	String,
	String1000,
	id,
	table,
} from '@evolu/common'

const SettingsId = id('Settings')
export type SettingsId = typeof SettingsId.Type

export const NonEmptyString100 = String.pipe(
	S.minLength(1),
	S.maxLength(100),
	S.brand('NonEmptyString100')
)

export const SettingsTable = table({
	id: SettingsId,
	bodyFont: NonEmptyString100,
	exportImageFooter: String1000,
	exportImageWatermark: SqliteBoolean,
	musicChannel: NonEmptyString100,
	showSplashDialog: S.NullOr(SqliteBoolean),
	theme: NonEmptyString100,
	titleFont: NonEmptyString100,
	toolbarMode: NonEmptyString100,
	writingDailyGoal: NonEmptyString100,
	writingDailyTarget: S.NullOr(PositiveInt),
	youtubeLink: String1000,
})
export type SettingsTable = typeof SettingsTable.Type
