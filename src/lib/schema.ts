import { pgTable, text, serial, integer, timestamp, boolean, doublePrecision } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: text('id').primaryKey(), // Clerk user ID
    email: text('email').notNull(),
    balance: integer('balance').notNull().default(1000), // Start with 1000
    role: text('role').notNull().default('user'), // 'user' or 'admin'
});

export const betsTable = pgTable('bets', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    imageUrl: text('image_url').notNull(), // Made mandatory for Polymarket aesthetics
    volume: integer('volume').notNull().default(0),
    endDate: timestamp('end_date').notNull(),
    resolved: boolean('resolved').notNull().default(false), // Did the admin resolve this?
    payoutsProcessed: boolean('payouts_processed').notNull().default(false), // Have winners been paid?
    winningOptionId: integer('winning_option_id'), // The ID of the winning option once resolved
});

export const betOptionsTable = pgTable('bet_options', {
    id: serial('id').primaryKey(),
    betId: integer('bet_id').notNull().references(() => betsTable.id),
    name: text('name').notNull(), // e.g., 'Yes', 'No'
    probability: doublePrecision('probability').notNull().default(50), // 0 to 100
});

export const transactionsTable = pgTable('transactions', {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull().references(() => usersTable.id),
    betOptionId: integer('bet_option_id').notNull().references(() => betOptionsTable.id),
    amount: integer('amount').notNull(), // How much they spent
    shares: integer('shares').notNull(), // How many shares they bought
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
