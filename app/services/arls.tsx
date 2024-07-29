import { SqliteQueryOptions } from '@evolu/common'
import { ARLS_OPTIONS } from '~/lib/constants'
import { evolu } from '~/services/evolu/client'
import { Id, Table, TableName } from '~/services/evolu/database'
import {
	BooksTable,
	HelpTable,
	PostsTable,
	SettingsTable,
	WritingEffortsTable,
} from '~/services/evolu/schema'

type QueryBuilderMethods<T extends Table> = {
	create(data: Partial<T>): T
	delete(where: Partial<T>): Promise<void>
	findMany(): Promise<ReadonlyArray<T>>
	findUnique(where: Partial<T>): Promise<T | undefined>
	update(id: Id, data: Omit<T, 'id'>): Promise<T>
}

type QueryBuilderOptions = {
	readonly subscribe?: boolean
} & SqliteQueryOptions

class TableQueryBuilder<T extends Table> implements QueryBuilderMethods<T> {
	constructor(
		private tableName: TableName,
		private options: QueryBuilderOptions = ARLS_OPTIONS
	) {}

	create(data: Partial<T>): T {
		return evolu.create(this.tableName, data) as T
	}

	async delete(where: Partial<T>): Promise<void> {
		// TODO: implement delete
		return
	}

	async findMany(): Promise<ReadonlyArray<T>> {
		// TODO: implement subscribe
		const findManyQuery = evolu.createQuery(
			(db) => db.selectFrom(this.tableName).selectAll(),
			this.options
		)
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

	async update(id: Id, data: Omit<T, 'id'>): Promise<T> {
		return evolu.update(this.tableName, { id, ...data }) as T
	}
}

export class Arls {
	books: TableQueryBuilder<BooksTable>
	_help: TableQueryBuilder<HelpTable>
	posts: TableQueryBuilder<PostsTable>
	settings: TableQueryBuilder<SettingsTable>
	writingEfforts: TableQueryBuilder<WritingEffortsTable>

	constructor() {
		// TODO: validate that the table exists and table name matches the table type
		this.books = new TableQueryBuilder('books')
		this._help = new TableQueryBuilder('_help')
		this.posts = new TableQueryBuilder('posts')
		this.settings = new TableQueryBuilder('settings', { subscribe: true })
		this.writingEfforts = new TableQueryBuilder('writingEfforts')
	}
}

const arls = new Arls()

export { arls }
