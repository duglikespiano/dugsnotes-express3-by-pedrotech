export async function register(req, res) {
	const body = req.body;
	console.log(body);
	res.json({ message: 'it works!' });
}
