import express from 'express';
import movieRouter from './routes/movieRoutes.js';
import dotenv from 'dotenv';
dotenv.config({});
const app = express();
const port = process.env.PORT || 5001;

app.use('/movies', movieRouter);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

// GET, POST, PUT, DELETE
