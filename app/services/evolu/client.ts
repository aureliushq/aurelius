import * as S from '@effect/schema/Schema'
import { SqliteBoolean } from '@evolu/common'
import { createEvolu } from '@evolu/common-web'
import { PositiveInt, String1000 } from '@evolu/react'
import {
	EditorToolbarMode,
	MusicChannels,
	WritingDailyGoalType,
} from '~/lib/types'
import { Database } from '~/services/evolu/database'
import { NonEmptyString100 } from '~/services/evolu/schema'

const evolu = createEvolu(Database, {
	// syncUrl: 'http://localhost:3000',
	initialData: (evolu) => {
		evolu.create('settings', {
			displaySplashDialog: S.decodeSync(SqliteBoolean)(1),
			defaultToolbarMode: S.decodeSync(NonEmptyString100)(
				EditorToolbarMode.FIXED
			),
			writingDailyGoal: S.decodeSync(NonEmptyString100)(
				WritingDailyGoalType.DURATION
			),
			writingDailyTarget: S.decodeSync(PositiveInt)(30),
			exportImageFooter: S.decodeSync(String1000)(''),
			exportImageWatermark: S.decodeSync(SqliteBoolean)(1),
			musicChannel: S.decodeSync(NonEmptyString100)(
				MusicChannels.LOFI_HIP_HOP
			),
			youtubeLink: S.decodeSync(String1000)(''),
		})
	},
})

export default evolu
