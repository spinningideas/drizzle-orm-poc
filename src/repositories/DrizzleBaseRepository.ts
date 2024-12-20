import { eq, and, or, sql } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { db } from '../db';
import { Criteria } from './Criteria';
import RepositoryResult from './RepositoryResult';
import RepositoryResultPaged from './RepositoryResultPaged';

const DEFAULT_PAGE_SIZE = 10;

export class DrizzleBaseRepository<T> {
  protected table: PgTable;
  protected idField: keyof T;

  constructor(table: PgTable, idField: keyof T) {
    this.table = table;
    this.idField = idField;
  }

  async findOneWhere(criteria: Criteria): Promise<RepositoryResult<T>> {
    try {
      const whereConditions = this.buildWhereConditions(criteria);
      const result = await db.select().from(this.table).where(whereConditions).limit(1);
      return {
        success: true,
        data: result[0] as T,
        error: undefined
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        error: [error.message] as any
      };
    }
  }

  async findWhere(criteria: Criteria): Promise<RepositoryResult<T[]>> {
    try {
      const whereConditions = this.buildWhereConditions(criteria);
      const result = await db.select().from(this.table).where(whereConditions);
      return {
        success: true,
        data: result as T[],
        error: undefined
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        error: [error.message] as any
      };
    }
  }

  async findAll(): Promise<RepositoryResult<T[]>> {
    try {
      const result = await db.select().from(this.table);
      return {
        success: true,
        data: result as T[],
        error: undefined
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        error: [error.message]
      };
    }
  }

  async findWherePaginated(
    criteria: Criteria,
    pageNumber: number,
    pageSize: number,
    orderBy?: string,
    orderDesc?: boolean
  ): Promise<RepositoryResultPaged<T, unknown>> {
    try {
      const limit = pageSize || DEFAULT_PAGE_SIZE;
      const offset = pageNumber ? pageNumber * limit : 0;
      const whereConditions = this.buildWhereConditions(criteria);

      const [result, countResult] = await Promise.all([
        db.select()
          .from(this.table)
          .where(whereConditions)
          .limit(limit)
          .offset(offset)
          .orderBy(orderBy ? sql`${orderBy} ${orderDesc ? 'DESC' : 'ASC'}` : undefined),
        db.select({ count: sql<number>`count(*)` })
          .from(this.table)
          .where(whereConditions)
      ]);

      const totalItems = Number(countResult[0].count);
      const totalPages = Math.ceil(totalItems / limit);

      return {
        success: true,
        data: result as T[],
        totalItems,
        totalPages,
        currentPage: pageNumber,
        errors: undefined
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        totalItems: 0,
        totalPages: 0,
        currentPage: pageNumber,
        errors: [error.message]
      };
    }
  }

  async create(model: Partial<T>): Promise<RepositoryResult<T>> {
    try {
      const result = await db.insert(this.table).values(model).returning();
      return {
        success: true,
        data: result[0] as T,
        error: undefined
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        error: [error.message]
      };
    }
  }

  async createMany(models: Partial<T>[]): Promise<RepositoryResult<T[]>> {
    try {
      const result = await db.insert(this.table).values(models).returning();
      return {
        success: true,
        data: result as T[],
        error: undefined
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        error: [error.message]
      };
    }
  }

  async updateWhere(criteria: Criteria, model: Partial<T>): Promise<RepositoryResult<T>> {
    try {
      const whereConditions = this.buildWhereConditions(criteria);
      const result = await db.update(this.table)
        .set(model)
        .where(whereConditions)
        .returning();
      return {
        success: true,
        data: result[0] as T,
        error: undefined
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        error: [error.message]
      };
    }
  }

  async deleteWhere(criteria: Criteria): Promise<RepositoryResult<T>> {
    try {
      const whereConditions = this.buildWhereConditions(criteria);
      const result = await db.delete(this.table)
        .where(whereConditions)
        .returning();
      return {
        success: true,
        data: result[0] as T,
        error: undefined
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        error: [error.message]
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
