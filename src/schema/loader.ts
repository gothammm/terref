import { existsSync, readFileSync } from 'fs';
import { OpenAPIV3 } from 'openapi-types';
import { Either, right, left } from 'fp-ts/lib/Either';
import { head } from 'fp-ts/lib/Array';
import { Option } from 'fp-ts/lib/Option';
import * as jay from 'js-yaml';

class SchemaLoader {
  private static ENCODING: string = 'utf-8';
  public static load(
    filePath: string
  ): Either<Error, Option<OpenAPIV3.Document>> {
    if (!filePath) {
      return left(
        new Error(`"${filePath}" is an invalid value for a file path.`)
      );
    }
    if (!existsSync(filePath)) {
      return left(new Error(`"${filePath}" is not a valid file path`));
    }
    const resultJson = jay.loadAll(
      readFileSync(filePath, SchemaLoader.ENCODING)
    );
    // Since yaml can have multiple documents, always pick the first one from the arrayList.
    const openAPIDocument = head<OpenAPIV3.Document>(resultJson);
    return right(openAPIDocument);
  }
}

export default SchemaLoader;
