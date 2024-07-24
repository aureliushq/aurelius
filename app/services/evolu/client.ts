import * as S from '@effect/schema/Schema'
import {
	ExtractRow,
	NonEmptyString1000,
	SqliteBoolean,
	createIndexes,
} from '@evolu/common'
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
	Int,
	NonEmptyString100,
	SqliteDateTime,
	WritingEffortId,
	WritingId,
} from '~/services/evolu/schema'

const indexes = createIndexes((create) => [
	create('indexWritingSlug').on('writing').column('slug'),
	create('indexWritingCreatedAt').on('writing').column('createdAt'),
	create('indexWritingEffortSlug').on('writingEffort').column('slug'),
])

export const evolu = createEvolu(Database, {
	name: 'Aurelius',
	indexes,
	initialData: (evolu) => {
		evolu.create('settings', {
			bodyFont: S.decodeSync(NonEmptyString100)(
				EditorSerifFonts.MERRIWEATHER
			),
			enableMusicPlayer: S.decodeSync(SqliteBoolean)(0),
			exportImageFooter: S.decodeSync(String1000)(''),
			exportImageWatermark: S.decodeSync(SqliteBoolean)(1),
			musicChannel: S.decodeSync(NonEmptyString100)(
				MusicChannels.LOFI_HIP_HOP
			),
			showSplashDialog: S.decodeSync(SqliteBoolean)(1),
			titleFont: S.decodeSync(NonEmptyString100)(
				EditorSansSerifFonts.INTER
			),
			toolbarMode: S.decodeSync(NonEmptyString100)(
				EditorToolbarMode.FIXED
			),
			writingDailyGoal: S.decodeSync(NonEmptyString100)(
				WritingDailyGoalType.DURATION
			),
			writingDailyTarget: S.decodeSync(Int)(30),
			youtubeLink: S.decodeSync(String1000)(''),
		})
		// create a default writing effort for posts
		evolu.create('writingEffort', {
			days: S.decodeSync(S.NonEmptyArray(NonEmptyString100))([
				'monday',
				'tuesday',
				'wednesday',
				'thursday',
				'friday',
			]),
			name: S.decodeSync(NonEmptyString100)('Post'),
			slug: S.decodeSync(NonEmptyString100)('post'),
			targetWordCount: S.decodeSync(PositiveInt)(300),
			time: S.decodeSync(SqliteDateTime)(
				Temporal.PlainTime.from('12:30:00').toString()
			),
		})
		// create a default writing effort for help content
		const { id: helpWritingEffortId } = evolu.create('writingEffort', {
			name: S.decodeSync(NonEmptyString100)('Help'),
			slug: S.decodeSync(NonEmptyString100)('help'),
		})
		// create a getting started guide under help
		evolu.create('_help', {
			content: S.decodeSync(Content)(GETTING_STARTED_GUIDE.content),
			slug: S.decodeSync(NonEmptyString100)('getting-started'),
			title: S.decodeSync(NonEmptyString1000)(
				GETTING_STARTED_GUIDE.title
			),
			effortId: helpWritingEffortId,
			wordCount: S.decodeSync(Int)(0),
		})
	},
})

export const helpArticleAllQuery = evolu.createQuery(
	(db) => db.selectFrom('_help').selectAll(),
	{
		logQueryExecutionTime: true,
		logExplainQueryPlan: true,
	}
)
export type HelpArticleRow = ExtractRow<typeof helpArticleAllQuery>

export const helpArticleBySlugQuery = (slug: string) =>
	evolu.createQuery(
		(db) =>
			db
				.selectFrom('_help')
				.selectAll()
				.where('slug', '=', S.decodeSync(NonEmptyString100)(slug)),
		{
			logQueryExecutionTime: true,
			logExplainQueryPlan: true,
		}
	)

export const settingsQuery = evolu.createQuery(
	(db) => db.selectFrom('settings').selectAll(),
	{
		logQueryExecutionTime: true,
		logExplainQueryPlan: true,
	}
)
export type SettingsRow = ExtractRow<typeof settingsQuery>

export const writingAllQuery = evolu.createQuery(
	(db) => db.selectFrom('writing').selectAll(),
	{
		logQueryExecutionTime: true,
		logExplainQueryPlan: true,
	}
)
export type WritingRow = ExtractRow<typeof writingAllQuery>

export const writingByIdQuery = (id: WritingId) =>
	evolu.createQuery(
		(db) => db.selectFrom('writing').selectAll().where('id', '=', id),
		{
			logQueryExecutionTime: true,
			logExplainQueryPlan: true,
		}
	)

export const writingBySlugQuery = (slug: NonEmptyString100) =>
	evolu.createQuery(
		(db) => db.selectFrom('writing').selectAll().where('slug', '=', slug),
		{
			logQueryExecutionTime: true,
			logExplainQueryPlan: true,
		}
	)

export const writingByWritingEffortQuery = ({
	slug,
	effortId,
}: {
	slug?: string
	effortId: string
}) =>
	evolu.createQuery(
		(db) => {
			let query = db.selectFrom('writing').selectAll()

			if (effortId) {
				query = query.where(
					'effortId',
					'=',
					S.decodeSync(WritingEffortId)(effortId)
				)
			}

			if (slug) {
				query = query.where(
					'slug',
					'=',
					S.decodeSync(NonEmptyString100)(slug)
				)
			}

			return query
		},
		{
			logQueryExecutionTime: true,
			logExplainQueryPlan: true,
		}
	)

export const writingEffortAllQuery = evolu.createQuery(
	(db) => db.selectFrom('writingEffort').selectAll(),
	{
		logQueryExecutionTime: true,
		logExplainQueryPlan: true,
	}
)
export type WritingEffortRow = ExtractRow<typeof writingEffortAllQuery>

export const writingEffortByIdQuery = (id: WritingEffortId) =>
	evolu.createQuery(
		(db) => db.selectFrom('writingEffort').selectAll().where('id', '=', id),
		{
			logQueryExecutionTime: true,
			logExplainQueryPlan: true,
		}
	)

export const writingEffortBySlugQuery = (slug: string) =>
	evolu.createQuery(
		(db) =>
			db
				.selectFrom('writingEffort')
				.selectAll()
				.where('slug', '=', S.decodeSync(NonEmptyString100)(slug)),
		{
			logQueryExecutionTime: true,
			logExplainQueryPlan: true,
		}
	)

export const writingSessionAllQuery = evolu.createQuery(
	(db) => db.selectFrom('writingSession').selectAll(),
	{
		logQueryExecutionTime: true,
		logExplainQueryPlan: true,
	}
)
export type WritingSessionRow = ExtractRow<typeof writingSessionAllQuery>
