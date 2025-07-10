const express = require('express');
const router = express.Router();

const server = express();


// Use routes
server.use('/', async (req, res, next) => {
  try {
    // Simulate route handling
    res.status(200).send('Hello from locgiogiasi-be !');

  } catch (error) {
    next(error);
  }
});

// Start the server
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});