import SchemaLoader from '../schema/loader';
import * as Either from 'fp-ts/lib/Either';
import * as Option from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { OpenAPIV3 } from 'openapi-types';
import { httpListener, r, createServer } from '@marblejs/core';
import { mapTo } from 'rxjs/operators';

export class TerrefEntry {
  static async init(openAPIDocumentPath: string) {
    const document = SchemaLoader.load(openAPIDocumentPath);

    if (Either.isLeft(document)) {
      return;
    }

    if (Option.isNone(document.right)) {
      return;
    }

    const appDocument = document.right.value;

    const paths = appDocument.paths;
    const pathKeys = Object.keys(paths);

    const effects = pathKeys.map((path: string) => {
      const pathObject = paths[path];
      const effect = r.pipe(
        r.matchPath(path),
        r.matchType('GET'),
        r.useEffect((req$) => {
          return req$.pipe(mapTo({ body: 'Hello, world!' }));
        })
      );
      return effect;
    });

    const listener = httpListener({
      effects,
    });

    const server = await createServer({
      port: 1337,
      hostname: '0.0.0.0',
      listener: listener,
    });

    await server();
  }
}
