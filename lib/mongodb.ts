import { MongoClient } from 'mongodb';

const options: object = {};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Lazy connection: no env check or connect at import time, so builds without a
// database (e.g. CI page-data collection) succeed; we only throw/connect when a
// route actually awaits the client. The global cache reuses one connection per
// process in both dev (hot reload) and prod.
function getClientPromise(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
  }
  if (!global._mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI, options);
    const pending = client.connect().catch(async (error: unknown) => {
      // A paused cluster or DNS outage must not poison this process forever.
      // Only evict this attempt; concurrent callers still share one connection.
      if (global._mongoClientPromise === pending) global._mongoClientPromise = undefined;
      await client.close().catch(() => {});
      throw error;
    });
    global._mongoClientPromise = pending;
  }
  return global._mongoClientPromise;
}

// Thenable wrapper keeps the historical `await clientPromise` interface intact.
const clientPromise = {
  then: (onfulfilled?: any, onrejected?: any) => getClientPromise().then(onfulfilled, onrejected),
  catch: (onrejected?: any) => getClientPromise().catch(onrejected),
  finally: (onfinally?: any) => getClientPromise().finally(onfinally),
} as Promise<MongoClient>;

export default clientPromise;
