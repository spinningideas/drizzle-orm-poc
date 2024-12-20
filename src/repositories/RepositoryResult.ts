/**
 * @summary Promise of Generic result from a given repository operation
 */
type RepositoryResult<DataType> = Promise<
  Result<DataType, string[]>
>;

/**
 * @summary Generic result for repositories.
 * Returns indicator if the operation was successful in the boolean "success".
 * Returns the actual payload of data in "data".
 * Returns any errors in "error".
 */
export class Result<DataType, ErrorType> {
  constructor(
    public success: boolean,
    public data: DataType,
    public error: ErrorType
  ) {
    if (success && error) {
      throw new Error("Successful result must not contain an error");
    }
    if (!success && !error) {
      throw new Error("Unsuccessful result must contain an error");
    }
  }

  public static ok<DataType>(data: DataType): Result<DataType, undefined> {
    return new Result(true, data, undefined);
  }

  public static fail<DataType>(error: string[]): Result<DataType | undefined, string[]> {
    return new Result(false, undefined, error);
  }
}

export default RepositoryResult;
