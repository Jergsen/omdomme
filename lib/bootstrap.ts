import { scheduleIngest } from '@/ingest/rss';

const globalForBootstrap = globalThis as unknown as { __ingestScheduled?: boolean };

if (!globalForBootstrap.__ingestScheduled) {
  scheduleIngest();
  globalForBootstrap.__ingestScheduled = true;
}
