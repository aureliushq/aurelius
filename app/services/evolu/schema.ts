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
	displaySplashDialog: S.NullOr(SqliteBoolean),
	defaultToolbarMode: NonEmptyString100,
	writingDailyGoal: NonEmptyString100,
	writingDailyTarget: S.NullOr(PositiveInt),
	exportImageFooter: String1000,
	exportImageWatermark: SqliteBoolean,
	musicChannel: NonEmptyString100,
	youtubeLink: String1000,
})
export type SettingsTable = typeof SettingsTable.Type
