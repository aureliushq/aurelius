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
	// syncUrl: 'http://localhost:3000',
	initialData: (evolu) => {
		evolu.create('settings', {
			bodyFont: S.decodeSync(NonEmptyString100)(
				EditorSerifFonts.MERRIWEATHER
			),
			defaultToolbarMode: S.decodeSync(NonEmptyString100)(
				EditorToolbarMode.FIXED
			),
			displaySplashDialog: S.decodeSync(SqliteBoolean)(1),
			exportImageFooter: S.decodeSync(String1000)(''),
			exportImageWatermark: S.decodeSync(SqliteBoolean)(1),
			musicChannel: S.decodeSync(NonEmptyString100)(
				MusicChannels.LOFI_HIP_HOP
			),
			theme: S.decodeSync(NonEmptyString100)(SiteTheme.SYSTEM),
			titleFont: S.decodeSync(NonEmptyString100)(
				EditorSansSerifFonts.INTER
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
