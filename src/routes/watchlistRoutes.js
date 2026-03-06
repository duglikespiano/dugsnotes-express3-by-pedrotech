import express from 'express';
import { addToWatchlist, updateWatchlistItem, removeFromWatchlist } from '../controllers/watchlistController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

// router.use(authMiddleware);
router.post('/', authMiddleware, addToWatchlist);
router.put('/:id', updateWatchlistItem);
router.delete('/:id', removeFromWatchlist);

export default router;
