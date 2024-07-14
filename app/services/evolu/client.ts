import * as S from '@effect/schema/Schema'
import { ExtractRow, SqliteBoolean } from '@evolu/common'
import { createEvolu } from '@evolu/common-web'
import { PositiveInt, String1000 } from '@evolu/react'
import {
	EditorSansSerifFonts,
	EditorSerifFonts,
	EditorToolbarMode,
	MusicChannels,
	SiteTheme,
	WritingDailyGoalType,
} from '~/lib/types'
import { Database } from '~/services/evolu/database'
import { NonEmptyString100 } from '~/services/evolu/schema'

export const evolu = createEvolu(Database, {
	initialData: (evolu) => {
		evolu.create('settings', {
			bodyFont: S.decodeSync(NonEmptyString100)(
				EditorSerifFonts.MERRIWEATHER
			),
			exportImageFooter: S.decodeSync(String1000)(''),
			exportImageWatermark: S.decodeSync(SqliteBoolean)(1),
			musicChannel: S.decodeSync(NonEmptyString100)(
				MusicChannels.LOFI_HIP_HOP
			),
			showSplashDialog: S.decodeSync(SqliteBoolean)(1),
			theme: S.decodeSync(NonEmptyString100)(SiteTheme.SYSTEM),
			titleFont: S.decodeSync(NonEmptyString100)(
				EditorSansSerifFonts.INTER
			),
			toolbarMode: S.decodeSync(NonEmptyString100)(
				EditorToolbarMode.FIXED
			),
			writingDailyGoal: S.decodeSync(NonEmptyString100)(
				WritingDailyGoalType.DURATION
			),
			writingDailyTarget: S.decodeSync(PositiveInt)(30),
			youtubeLink: S.decodeSync(String1000)(''),
		})
	},
})

export const settingsQuery = evolu.createQuery(
	(db) => db.selectFrom('settings').selectAll(),
	{
		logQueryExecutionTime: true,
	}
)
export type SettingsRow = ExtractRow<typeof settingsQuery>
