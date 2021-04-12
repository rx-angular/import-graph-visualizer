import express from 'express';
import open from 'open';
import ora from 'ora';
import path from 'path';

const PORT = 4000;
const url = `http://localhost:${PORT}`;

export function runStaticServer(): void {
  const spinner = ora(`Opening browser at ${url}`).start();

  const app = express();

  app.use(express.static(path.join(__dirname, '..', 'app')));
  app.use('/assets', express.static(path.join(__dirname, '..', 'cli')));

  app.listen(PORT, () => {
    open(url).then(() => {
      spinner.succeed(`Opened browser at ${url}`);
    });
  });
}
