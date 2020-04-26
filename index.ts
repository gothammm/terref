import { TerrefEntry } from './src/core/entry';


(async () => {
  await TerrefEntry.init(`${__dirname}/test.yaml`);
  console.log('Launched');
})();