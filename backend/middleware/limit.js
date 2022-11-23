// Importer le module express rate limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: "Plusieurs tantatives de connexion echouée. Votre compte est bloqué pour 10 minutes"
});

module.exports = { limiter };  