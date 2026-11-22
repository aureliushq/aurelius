import type { ExtractRow, Query, SqliteQueryOptions } from '@evolu/common'
import { ARLS_OPTIONS } from '~/lib/constants'
import { createEvoluClient } from '~/services/evolu/client'
import type { Id, Table, TableName } from '~/services/evolu/database'
import type {
	BooksTable,
	HelpTable,
	PostsTable,
	SettingsTable,
	WritingEffortId,
	WritingEffortsTable,
	WritingSessionsTable,
} from '~/services/evolu/schema'

type DeleteWhere = {
	id: Id
	effortId?: WritingEffortId
}

type UpdateWhere<T> = {
	id: Id
	data: Partial<T>
}

type QueryBuilderMethods<T extends Table> = {
	create(data: Partial<T>): Promise<ExtractRow<Query<T>>>
	delete({ id, effortId }: DeleteWhere): Promise<ExtractRow<Query<T>>>
	findMany(options?: FindManyOptions<T>): Promise<ReadonlyArray<T>>
	findUnique(where: Partial<T>): Promise<T | undefined>
	update({ id, data }: UpdateWhere<T>): Promise<ExtractRow<Query<T>>>
}

type QueryBuilderOptions = {
	readonly subscribe?: boolean
} & SqliteQueryOptions

type FindManyOptions<T extends Table> = {
	limit?: number
	orderBy?: {
		column: keyof T
		direction: 'asc' | 'desc'
	}
	where?: Partial<T>
}

export class TableQueryBuilder<T extends Table>
	implements QueryBuilderMethods<T>
{
	constructor(
		private tableName: TableName,
		private options: QueryBuilderOptions = ARLS_OPTIONS,
	) {}

	private getEvolu() {
		return createEvoluClient()
	}

	async create(data: Partial<T>): Promise<ExtractRow<Query<T>>> {
		const evolu = this.getEvolu()
		return evolu.create(this.tableName, data) as unknown as Promise<
			ExtractRow<Query<T>>
		>
	}

	async delete({ id, effortId }: DeleteWhere): Promise<ExtractRow<Query<T>>> {
		// TODO: implement delete
		const evolu = this.getEvolu()
		return this.tableName === '_help' ||
			this.tableName === 'settings' ||
			this.tableName === 'writingSessions'
			? (evolu.update(this.tableName, {
					// @ts-ignore
					id,
					isDeleted: true,
				}) as unknown as Promise<ExtractRow<Query<T>>>)
			: (evolu.update(this.tableName, {
					// @ts-ignore
					id,
					effortId,
					isDeleted: true,
				}) as unknown as Promise<ExtractRow<Query<T>>>)
	}

	async findMany(options: FindManyOptions<T>): Promise<ReadonlyArray<T>> {
		const evolu = this.getEvolu()
		const { limit, orderBy, where = {} } = options
		// TODO: implement subscribe
		const findManyQuery = evolu.createQuery((db) => {
			let query = db.selectFrom(this.tableName).selectAll()

			query = query.where('isDeleted', 'is', null)
			// apply where
			for (const [key, value] of Object.entries(where)) {
				// @ts-ignore
				query = query.where(key, '=', value)
			}

			// apply orderBy
			if (orderBy) {
				// @ts-ignore
				query = query.orderBy(orderBy.column, orderBy.direction)
			}

			// apply limit
			if (limit) {
				query = query.limit(limit)
			}

			return query
		}, this.options)
		const { rows } = await evolu.loadQuery(findManyQuery)
		return rows as ReadonlyArray<T>
	}

	async findManyWithJoin<J extends Table>(
		joinTable: string,
		joinCondition: { leftKey: string; rightKey: string },
		where: Partial<T> = {},
		select: (keyof T | keyof J)[] = [],
	) {
		const evolu = this.getEvolu()
		const query = evolu.createQuery((db) => {
			let query = db.selectFrom(this.tableName).innerJoin(
				// @ts-ignore
				joinTable,
				joinCondition.leftKey,
				joinCondition.rightKey,
			)

			if (select.length > 0) {
				query = query
					// @ts-ignore
					.select(
						select.map(
							(field) => `${this.tableName}.${String(field)}`,
						),
					)
					.select(
						select.map((field) => `${joinTable}.${String(field)}`),
					)
			} else {
				query = query
					// @ts-ignore
					.selectAll(`${this.tableName}.*`)
					// @ts-ignore
					.selectAll(`${joinTable}.*`)
			}

			for (const [key, value] of Object.entries(where)) {
				// @ts-ignore
				query = query.where(`${this.tableName}.${key}`, '=', value)
			}

			return query
		}, this.options)

		const { rows } = await evolu.loadQuery(query)
		return rows
	}

	async findUnique(where: Partial<T>): Promise<T | undefined> {
		const evolu = this.getEvolu()
		const findUniqueQuery = evolu.createQuery((db) => {
			let query = db.selectFrom(this.tableName).selectAll()
			query = query.where('isDeleted', 'is', null)
			for (const [key, value] of Object.entries(where)) {
				// @ts-ignore
				query = query.where(key, '=', value)
			}

			return query
		}, this.options)
		const { row } = await evolu.loadQuery(findUniqueQuery)
		return row as Readonly<T>
	}

	async update({ id, data }: UpdateWhere<T>): Promise<ExtractRow<Query<T>>> {
		const evolu = this.getEvolu()
		return evolu.update(this.tableName, {
			id,
			...data,
		}) as unknown as Promise<ExtractRow<Query<T>>>
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
