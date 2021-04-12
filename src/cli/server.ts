import express from 'express';
import path from 'path';

export function runStaticServer(): void {
  const app = express();

  app.use(express.static(path.join(__dirname, '..', 'app')));
  app.use('/assets', express.static(path.join(__dirname, '..', 'cli')));

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(
      `Visit import graph visualizer in your browser at http://localhost:${PORT}`,
    );
  });
}
