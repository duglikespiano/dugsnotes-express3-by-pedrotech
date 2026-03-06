import express from 'express';
import movieRouter from './routes/movieRoutes.js';
import authRouter from './routes/authRoutes.js';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';

dotenv.config({ path: './src/.env' });
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/movies', movieRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on('unhandledRejection', (err) => {
	console.error('Unhandled Rejection:', err);
	server.close(async () => {
		await disconnectDB();
		process.exit(1);
	});
});

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
	console.error('Uncaught Exception:', err);
	await disconnectDB();
	process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
	console.log('SIGTERM received, shutting down gracefully');
	server.close(async () => {
		await disconnectDB();
		process.exit(0);
	});
});

// GET, POST, PUT, DELETE
