export function validateRequest(schema) {
	return function (req, res, next) {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			const formattedErros = result.error.format();
			const flatErrors = Object.values(formattedErros)
				.flat()
				.filter((item) => typeof item === 'object' && item !== null && !Array.isArray(item))[0]['_errors'][0];

			return res.status(400).json({ message: flatErrors });
		}

		next();
	};
}
