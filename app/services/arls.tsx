import { ExtractRow, Query, SqliteQueryOptions } from '@evolu/common'
import { ARLS_OPTIONS } from '~/lib/constants'
import { evolu } from '~/services/evolu/client'
import { Id, Table, TableName } from '~/services/evolu/database'
import {
	BooksTable,
	HelpTable,
	PostsTable,
	SettingsTable,
	WritingEffortsTable,
	WritingSessionsTable,
} from '~/services/evolu/schema'

type QueryBuilderMethods<T extends Table> = {
	create(data: Partial<T>): ExtractRow<Query<T>>
	delete(where: Partial<T>): Promise<void>
	findMany(where: Partial<T>): Promise<ReadonlyArray<T>>
	findUnique(where: Partial<T>): Promise<T | undefined>
	update(id: Id, data: Omit<T, 'id'>): ExtractRow<Query<T>>
}

type QueryBuilderOptions = {
	readonly subscribe?: boolean
} & SqliteQueryOptions

export class TableQueryBuilder<T extends Table>
	implements QueryBuilderMethods<T>
{
	constructor(
		private tableName: TableName,
		private options: QueryBuilderOptions = ARLS_OPTIONS
	) {}

	create(data: Partial<T>): ExtractRow<Query<T>> {
		return evolu.create(this.tableName, data) as ExtractRow<Query<T>>
	}

	async delete(where: Partial<T>): Promise<void> {
		// TODO: implement delete
		return
	}

	async findMany(where: Partial<T> = {}): Promise<ReadonlyArray<T>> {
		// TODO: implement subscribe
		const findManyQuery = evolu.createQuery((db) => {
			let query = db.selectFrom(this.tableName).selectAll()
			Object.entries(where).forEach(([key, value]) => {
				query = query.where(key as any, '=', value)
			})

			return query
		}, this.options)
		const { rows } = await evolu.loadQuery(findManyQuery)
		return rows as ReadonlyArray<T>
	}

	async findUnique(where: Partial<T>): Promise<T | undefined> {
		let findUniqueQuery = evolu.createQuery((db) => {
			let query = db.selectFrom(this.tableName).selectAll()
			Object.entries(where).forEach(([key, value]) => {
				query = query.where(key as any, '=', value)
			})

			return query
		}, this.options)
		const { row } = await evolu.loadQuery(findUniqueQuery)
		return row as Readonly<T>
	}

	update(id: Id, data: Omit<T, 'id'>): ExtractRow<Query<T>> {
		return evolu.update(this.tableName, { id, ...data }) as ExtractRow<
			Query<T>
		>
	}
}

export class Arls {
	books: TableQueryBuilder<BooksTable>
	_help: TableQueryBuilder<HelpTable>
	posts: TableQueryBuilder<PostsTable>
	settings: TableQueryBuilder<SettingsTable>
	writingEfforts: TableQueryBuilder<WritingEffortsTable>
	writingSessions: TableQueryBuilder<WritingSessionsTable>

	constructor() {
		// TODO: validate that the table exists and table name matches the table type
		this.books = new TableQueryBuilder('books')
		this._help = new TableQueryBuilder('_help')
		this.posts = new TableQueryBuilder('posts')
		this.settings = new TableQueryBuilder('settings', { subscribe: true })
		this.writingEfforts = new TableQueryBuilder('writingEfforts')
		this.writingSessions = new TableQueryBuilder('writingSessions')
	}
}

const arls = new Arls()

export { arls }
