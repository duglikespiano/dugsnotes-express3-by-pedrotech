import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });
const jwtCookieName = process.env.JWT_COOKIE_NAME;

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

export async function generateToken(userId, res) {
	const payload = { id: userId };
	const token = jwt.sign(payload, jwtSecret, {
		expiresIn: jwtExpiresIn,
	});

	res.cookie(jwtCookieName, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7d,
	});
	return token;
}
