// Importer les modules natifs et externes
const express = require('express');
const userCtrl = require('../controllers/user');
const max = require('../middleware/limit');

// Route
const router = express.Router();

router.post('/signup', userCtrl.signup); // User essaye d'accéder au chemin /signup avec post
router.post('/login', max.limiter, userCtrl.login);

// On exporte router
module.exports = router;