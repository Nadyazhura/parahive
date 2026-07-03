import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`ParaHive backend listening on http://localhost:${env.port}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down backend`);
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
