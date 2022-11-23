// Impoter le module json web token
const jwt = require('jsonwebtoken');

// Fonction autorisation
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodeToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodeToken.userId;
        // Création d'un objet auth
        req.auth = {userId};
        if(req.body.userId && req.body.userId !== userId) {
            throw 'Identifiant utilisateur invalide'
        } else {
            next();
        }
    }
    catch {
        res.status(401).json({
            error: new Error('Requête invalide !')
        });
    }
};


