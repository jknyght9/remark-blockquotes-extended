import fs from 'fs'
import { remark } from 'remark';
import { reporter } from 'vfile-reporter';
import remarkBlockquoteExtended from '../index.js';

const buffer = fs.readFileSync('example.md');

remark()
  .use(remarkBlockquoteExtended)
  .process(buffer)
  .then((results) => {
    console.error(reporter(results))
  })