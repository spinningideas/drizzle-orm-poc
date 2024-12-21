/**
 * @summary Generic paginated result for repositories.
 * Returns indicator if the operation was successful in the boolean "success".
 * Returns the actual payload of data in "data".
 * Returns any errors in "error".
 * Includes pagination metadata.
 */
export class RepositoryResultPaged<DataType> {
  constructor(
    public success: boolean,
    public data: DataType,
    public errors: string[] | undefined,
    public currentPage: number,
    public totalPages: number,
    public totalItems: number
  ) {
    if (success && errors) {
      throw new Error("Successful result must not contain an error");
    }
    if (!success && !errors) {
      throw new Error("Unsuccessful result must contain an error");
    }
  }

  public static ok<DataType>(
    data: DataType,
    currentPage: number,
    totalPages: number,
    totalItems: number
  ): RepositoryResultPaged<DataType> {
    return new RepositoryResultPaged(
      true,
      data,
      undefined,
      currentPage,
      totalPages,
      totalItems
    );
  }

  public static fail<DataType>(
    error: string[],
    currentPage: number = 0,
    totalPages: number = 0,
    totalItems: number = 0
  ): RepositoryResultPaged<DataType | undefined> {
    return new RepositoryResultPaged(
      false,
      undefined,
      error,
      currentPage,
      totalPages,
      totalItems
    );
  }
}

export default RepositoryResultPaged;
