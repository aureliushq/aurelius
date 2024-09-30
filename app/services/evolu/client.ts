import * as S from '@effect/schema/Schema'
import { ExtractRow, SqliteBoolean, createIndexes } from '@evolu/common'
import { createEvolu } from '@evolu/common-web'
import { PositiveInt, String1000 } from '@evolu/react'
import { Temporal } from 'temporal-polyfill'
import { GETTING_STARTED_GUIDE } from '~/lib/constants'
import {
	EditorSansSerifFonts,
	EditorSerifFonts,
	EditorToolbarMode,
	MusicChannels,
	WritingDailyGoalType,
} from '~/lib/types'
import { Database } from '~/services/evolu/database'
import {
	Content,
	EffortType,
	Int,
	NonEmptyString100,
	SqliteDateTime,
	WritingEffortType,
} from '~/services/evolu/schema'

const indexes = createIndexes((create) => [
	create('indexBooksCreatedAt').on('books').column('createdAt'),
	create('indexChapterBookId').on('chapters').column('bookId'),
	create('indexChapterSlug').on('chapters').column('slug'),
	create('indexEssayCreatedAt').on('essays').column('createdAt'),
	create('indexEssaysSlug').on('essays').column('slug'),
	create('indexJournalsCreatedAt').on('journals').column('createdAt'),
	create('indexJournalsSlug').on('journals').column('slug'),
	create('indexPostsCreatedAt').on('posts').column('createdAt'),
	create('indexPostsSlug').on('posts').column('slug'),
	create('indexWritingEffortSlug').on('writingEfforts').column('slug'),
])

export const evolu = createEvolu(Database, {
	name: 'Aurelius',
	indexes,
	initialData: (evolu) => {
		evolu.create('settings', {
			bodyFont: S.decodeSync(NonEmptyString100)(
				EditorSerifFonts.MERRIWEATHER,
			),
			enableMusicPlayer: S.decodeSync(SqliteBoolean)(0),
			exportImageFooter: S.decodeSync(String1000)(''),
			exportImageWatermark: S.decodeSync(SqliteBoolean)(1),
			musicChannel: S.decodeSync(NonEmptyString100)(
				MusicChannels.LOFI_HIP_HOP,
			),
			showSplashDialog: S.decodeSync(SqliteBoolean)(1),
			titleFont: S.decodeSync(NonEmptyString100)(
				EditorSansSerifFonts.INTER,
			),
			toolbarMode: S.decodeSync(NonEmptyString100)(
				EditorToolbarMode.FIXED,
			),
			userName: S.decodeSync(String1000)(''),
			writingDailyGoal: S.decodeSync(NonEmptyString100)(
				WritingDailyGoalType.DURATION,
			),
			writingDailyTarget: S.decodeSync(Int)(30),
			youtubeLink: S.decodeSync(String1000)(''),
		})
		// create a default writing effort for posts
		evolu.create('writingEfforts', {
			days: S.decodeSync(S.NonEmptyArray(NonEmptyString100))([
				'monday',
				'tuesday',
				'wednesday',
				'thursday',
				'friday',
			]),
			description: S.decodeSync(String1000)(''),
			name: S.decodeSync(NonEmptyString100)('Posts'),
			slug: S.decodeSync(NonEmptyString100)('posts'),
			targetWordCount: S.decodeSync(PositiveInt)(300),
			time: S.decodeSync(SqliteDateTime)(
				Temporal.PlainTime.from('12:30:00').toString(),
			),
			type: S.decodeSync(EffortType)(WritingEffortType.POSTS),
		})
		// create a getting started guide under _help
		evolu.create('_help', {
			content: S.decodeSync(Content)(GETTING_STARTED_GUIDE.content),
			slug: S.decodeSync(NonEmptyString100)('getting-started'),
			title: S.decodeSync(String1000)(GETTING_STARTED_GUIDE.title),
			wordCount: S.decodeSync(Int)(0),
		})
	},
})

export const settingsQuery = evolu.createQuery(
	(db) => db.selectFrom('settings').selectAll(),
	{
		logQueryExecutionTime: true,
		logExplainQueryPlan: true,
	},
)
export type SettingsRow = ExtractRow<typeof settingsQuery>
