import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });
const jwtCookieName = process.env.JWT_COOKIE_NAME;
const jwtSecret = process.env.JWT_SECRET;

// Read the token from the request
// Check if token is valid
export async function authMiddleware(req, res, next) {
	let token;
	const { authorization } = req.headers;
	const jwtToken = req.cookies ? req.cookies['dugsnotes-express3-jwt'] : null;

	if (authorization && authorization.startsWith('Bearer')) {
		token = authorization.split(' ')[1];
	} else if (jwtToken) {
		console.log(jwtCookieName, 'cookie');
		token = jwtToken;
	}

	if (!token) {
		return res.status(401).json({ error: 'Not authorized, no token provided' });
	}

	try {
		// Verify token and extract the user id
		const decoded = jwt.verify(token, jwtSecret);
		const user = await prisma.user.findUnique({ where: { id: decoded.id } });

		if (!user) {
			return res.status(401).json({ error: 'User no longer exists' });
		}

		req.user = user;

		next();
	} catch (err) {
		return res.status(401).json({ error: 'Not authorized, token failed' });
	}
}
