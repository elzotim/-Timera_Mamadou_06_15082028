// Importer des modules natifs et externes
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path'); // Chemin pour acceder au chemin de notre serveur
require('dotenv').config();
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//Création d'une application express
const app = express();



// Connexion à la base de données
mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

/************************************************************************************/
/*                           MIDDLEWARES                                            */
/************************************************************************************/

// Interception de toutes les requêtes qui ont un Content-type: json
app.use(express.json());

// CORS pour autoriser les requêtes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Sécurise les headers
app.use(helmet());
// Nettoie le corps, paramètres des requêtes pour se proteger contre les scripts XSS et les attaques par injection
//app.use(sanitizeMiddleware()); 

// Midleware qui charge les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Enregistrement des routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// Exporter l'application express
module.exports = app;