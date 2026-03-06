const express = require('express');
require('dotenv').config({});
const app = express();
const port = process.env.PORT || 5001;

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
	console.log('check');
});

// GET, POST, PUT, DELETE
