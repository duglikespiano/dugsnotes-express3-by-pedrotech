import { prisma } from '../config/db.js';

export async function addToWatchlist(req, res) {
	const { movieId, userId, status, rating, notes } = req.body;

	// Verify movie exists
	const movie = await prisma.movie.findUnique({
		where: { id: movieId },
	});

	if (!movie) {
		return res.status(404).json({ error: 'Movie not found' });
	}

	// Check if already added
	const existingInWatchlist = await prisma.watchlistItem.findUnique({
		where: {
			userId_movieId: {
				userId,
				movieId,
			},
		},
	});

	if (existingInWatchlist) {
		return res.status(400).json({ error: 'Movie already in the watchlist' });
	}

	const watchlistItem = await prisma.watchlistItem.create({
		data: {
			userId,
			movieId,
			status: status || 'PLANNED',
			rating,
			notes,
		},
	});

	res.status(201).json({
		status: 'Success',
		data: {
			watchlistItem,
		},
	});
}
