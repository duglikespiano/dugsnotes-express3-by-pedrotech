import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const nodeEnv = process.env.NODE_ENV;

const prisma = new PrismaClient({
	adapter,
	log: nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

async function connectDB() {
	try {
		await prisma.$connect();
		console.log('DB connected via Prisma');
	} catch (err) {
		console.error(`Database connection error: ${err.message}`);
		process.exit(1);
	}
}

async function disconnectDB() {
	await prisma.$disconnect();
}

export { prisma, connectDB, disconnectDB };
