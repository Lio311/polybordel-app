import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Lazy initialization — only connects at runtime, not during Next.js build
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
    if (!_db) {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not set');
        }
        const sql = neon(process.env.DATABASE_URL);
        _db = drizzle(sql, { schema });
    }
    return _db;
}

// Transparent proxy so all existing `db.select()...` calls work unchanged
export const db = new Proxy({} as ReturnType<typeof getDb>, {
    get(_target, prop: string) {
        return (getDb() as unknown as Record<string, unknown>)[prop];
    },
});

