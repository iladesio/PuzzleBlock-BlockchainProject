// helloworld.js located in /api/user
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Handle the response directly in this file
  res.json({ message: 'Hello, World!' });
});

// Export the router
module.exports = router;