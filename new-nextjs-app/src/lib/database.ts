// Lightweight wrapper to reuse the server's MongoDB connector inside Next.js API routes
// This bridges the alias import `@/lib/database` used across API handlers.
// The underlying implementation resides in `server/config/db.js`.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const connectDB = require('../../server/config/db');

export { connectDB };


