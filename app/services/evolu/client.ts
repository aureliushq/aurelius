import * as S from '@effect/schema/Schema'
import {
	type Evolu,
	type ExtractRow,
	SqliteBoolean,
	createIndexes,
} from '@evolu/common'
import { createEvolu } from '@evolu/common-web'
import { PositiveInt, String1000 } from '@evolu/react'
import { Temporal } from 'temporal-polyfill'
import {
	EditorSansSerifFonts,
	EditorSerifFonts,
	EditorToolbarMode,
	MusicChannels,
	StartPage,
	WritingDailyGoalType,
} from '~/lib/types'
import { Database } from '~/services/evolu/database'
import { runMigrations } from '~/services/evolu/migrations'
import {
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

export const createEvoluClient = () => {
	return createEvolu(Database, {
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
				startPage: S.decodeSync(NonEmptyString100)(
					StartPage.VIEW_ALL_POSTS,
				),
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
			runMigrations(evolu as Evolu)
		},
	})
}

export const createSettingsQuery = (evolu: Evolu) =>
	evolu.createQuery((db) => db.selectFrom('settings').selectAll(), {
		logQueryExecutionTime: true,
		logExplainQueryPlan: true,
	})

export type SettingsRow = ExtractRow<ReturnType<typeof createSettingsQuery>>
