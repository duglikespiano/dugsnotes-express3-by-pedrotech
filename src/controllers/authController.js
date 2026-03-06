import { prisma } from '../config/db.js';
import { generateToken } from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });
const jwtCookieName = process.env.JWT_COOKIE_NAME;

export async function register(req, res) {
	const { name, email, password } = req.body;

	// Check if user already exists
	const userExists = await prisma.user.findUnique({
		where: { email: email },
	});

	if (userExists) {
		return res.status(400).json({ error: 'User already exists with this email' });
	}

	// Hash Password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create User
	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	// Generate JWT
	const token = await generateToken(user.id, res);

	res.status(201).json({
		status: 'success',
		data: {
			user: {
				id: user.id,
				name: name,
				email: email,
			},
			token,
		},
	});
}

export async function login(req, res) {
	const { email, password } = req.body;

	// Check if user email exists in the table
	const user = await prisma.user.findUnique({ where: { email: email } });
	if (!user) return res.status(401).json({ error: 'Invalid email or password' });

	// Verify password
	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });

	// Generate JWT
	const token = await generateToken(user.id, res);

	res.status(201).json({
		status: 'success',
		data: {
			user: {
				id: user.id,
				email: email,
			},
			token,
		},
	});
}

export async function logout(req, res) {
	res.cookie(jwtCookieName, '', {
		httpOnly: true,
		expires: new Date(0),
	});

	res.status(200).json({
		status: 'success',
		message: 'logged out successfully',
	});
}
