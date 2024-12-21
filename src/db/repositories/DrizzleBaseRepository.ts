import {
  eq,
  and,
  sql,
  getTableColumns,
  ColumnBaseConfig,
  ColumnDataType,
} from "drizzle-orm";
import { QueryBuilder, PgColumn, PgTable } from "drizzle-orm/pg-core";
import { Criteria } from "./Criteria";
import RepositoryResult from "./RepositoryResult";
import RepositoryResultPaged from "./RepositoryResultPaged";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

const DEFAULT_PAGE_SIZE = 10;

export class DrizzleBaseRepository<T, Schema extends Record<string, unknown> = any> {
  protected database: NodePgDatabase<Schema>;
  protected table: PgTable;
  protected idField: keyof T;
  protected qb: QueryBuilder;
  protected columns: Record<
    string,
    PgColumn<ColumnBaseConfig<ColumnDataType, string>, {}, {}>
  >;

  constructor(database: NodePgDatabase<Schema>, table: PgTable, idField: keyof T) {
    this.database = database;
    this.table = table;
    this.idField = idField;
    this.qb = new QueryBuilder();
    this.columns = getTableColumns(table);
  }

  async findOneWhere(criteria: Criteria): Promise<RepositoryResult<T>> {
    try {
      const whereConditions = this.buildWhereConditions(criteria);
      const result = await this.database
        .select()
        .from(this.table)
        .where(whereConditions)
        .limit(1);
      return {
        success: true,
        data: result[0] as T,
        errors: undefined,
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        errors: [error.message] as any,
      };
    }
  }

  async findWhere(criteria: Criteria): Promise<RepositoryResult<T[]>> {
    try {
      const whereConditions = this.buildWhereConditions(criteria);
      const result = await this.database
        .select()
        .from(this.table)
        .where(whereConditions);
      return {
        success: true,
        data: result as T[],
        errors: undefined,
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        errors: [error.message] as any,
      };
    }
  }

  async findAll(): Promise<RepositoryResult<T[]>> {
    try {
      const result = await this.database.select().from(this.table);
      return {
        success: true,
        data: result as T[],
        errors: undefined,
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        errors: [error.message],
      };
    }
  }

  async findWherePaginated(
    criteria: Criteria,
    pageNumber: number,
    pageSize: number,
    orderBy?: string,
    orderDesc?: boolean
  ): Promise<RepositoryResultPaged<T[]>> {
    try {
      const limit = pageSize || DEFAULT_PAGE_SIZE;
      const offset = pageNumber ? pageNumber * limit : 0;
      const whereConditions = this.buildWhereConditions(criteria);

      const [result, countResult] = await Promise.all([
        this.database
          .select()
          .from(this.table)
          .where(whereConditions)
          .limit(limit)
          .offset(offset)
          .orderBy(
            orderBy ? sql`${orderBy} ${orderDesc ? "DESC" : "ASC"}` : undefined
          ),
        this.database
          .select({ count: sql<number>`count(*)` })
          .from(this.table)
          .where(whereConditions),
      ]);

      const totalItems = Number(countResult[0].count);
      const totalPages = Math.ceil(totalItems / limit);

      return {
        success: true,
        data: result as T[],
        totalItems,
        totalPages,
        currentPage: pageNumber,
        errors: undefined,
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        totalItems: 0,
        totalPages: 0,
        currentPage: pageNumber,
        errors: [error.message],
      };
    }
  }

  async create(model: Partial<T>): Promise<RepositoryResult<T>> {
    try {
      const result = await this.database
        .insert(this.table)
        .values(model)
        .returning();
      return {
        success: true,
        data: result[0] as T,
        errors: undefined,
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        errors: [error.message],
      };
    }
  }

  async createMany(models: Partial<T>[]): Promise<RepositoryResult<T[]>> {
    try {
      const result = await this.database
        .insert(this.table)
        .values(models)
        .returning();
      return {
        success: true,
        data: result as T[],
        errors: undefined,
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        errors: [error.message],
      };
    }
  }

  async updateWhere(
    criteria: Criteria,
    model: Partial<T>
  ): Promise<RepositoryResult<T>> {
    try {
      const whereConditions = this.buildWhereConditions(criteria);
      const result = await this.database
        .update(this.table)
        .set(model)
        .where(whereConditions)
        .returning();
      return {
        success: true,
        data: result[0] as T,
        errors: undefined,
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        errors: [error.message],
      };
    }
  }

  async deleteWhere(criteria: Criteria): Promise<RepositoryResult<T>> {
    try {
      const whereConditions = this.buildWhereConditions(criteria);
      const result = await this.database
        .delete(this.table)
        .where(whereConditions)
        .returning();
      return {
        success: true,
        data: result[0] as T,
        errors: undefined,
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        errors: [error.message],
      };
    }
  }

  private buildWhereConditions(criteria: Criteria) {
    if (!criteria || !criteria.fields) {
      return undefined;
    }

    const conditions = Object.entries(criteria.fields).map(([key, value]) => {
      if (Array.isArray(value)) {
        return sql`${key} = ANY(${value})`;
      }
      return eq(this.table[key], value);
    });

    return and(...conditions);
  }
}
