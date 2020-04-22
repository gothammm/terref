import Ajv, { ErrorObject, ValidationError } from 'ajv';
import * as jsonSchemaDraft04 from 'ajv/lib/refs/json-schema-draft-04';
import * as openAPI3Schema from './resources/v3.0/schema.json';
import { OpenAPIV3 } from 'openapi-types';
import { Either, left, right } from 'fp-ts/lib/Either';

class SchemaValidator {
  private static getOpenAPI3Validator() {
    const ajv = new Ajv({ schemaId: 'auto', allErrors: true });
    ajv.addMetaSchema(jsonSchemaDraft04);
    ajv.addSchema(openAPI3Schema);
    return ajv.compile(openAPI3Schema);
  }
  public static async validate(
    apiSpecDocument: OpenAPIV3.Document
  ): Promise<Either<ValidationError, OpenAPIV3.Document>> {
    const validator = this.getOpenAPI3Validator();
    try {
      const result = await (validator(apiSpecDocument) as Promise<
        OpenAPIV3.Document
      >);
      return right(result);
    } catch (ex) {
      return left(ex as ValidationError);
    }
  }
}

export default SchemaValidator;
