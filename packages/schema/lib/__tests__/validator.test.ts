import SchemaValidator from '../validator';
import SchemaLoader from '../loader';
import path from 'path';
import * as Either from 'fp-ts/lib/Either';
import * as Option from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { OpenAPIV3 } from 'openapi-types';

const getPetstoreYamlPath = () =>
  path.resolve(`${__dirname}/__fixtures__/petstore.yaml`);

describe('#schemaValidator', () => {
  test(`should return validation result for a openapi spec.`, () => {
    const result = SchemaLoader.load(getPetstoreYamlPath());
    expect(Either.isRight(result)).toEqual(true);

    const doc = pipe(
      Either.getOrElse((_: Error) =>
        Option.option.of({} as OpenAPIV3.Document)
      )(result),
      Option.getOrElse(() => ({} as OpenAPIV3.Document))
    );
    expect(doc.openapi).toEqual('3.0.0');
  });
});
