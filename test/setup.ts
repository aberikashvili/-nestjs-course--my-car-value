import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    const fileName = join(__dirname, '..', 'test.sqlite');

    await rm(fileName);
  } catch (err) {
    console.error('ERROR', err);
  }
});
