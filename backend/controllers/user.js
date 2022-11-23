// Importer les modules natifs et externes
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');
const User = require('../models/user');

// Créer un schema
const schemaPasswordValidator = new passwordValidator();

// Ajouter des propriétés au schema
schemaPasswordValidator
.is().min(8)                  // Longueur minimale 8
.is().max(25)                 // Longueur maximale 25
.has().uppercase(1)           // Doit avoir au moins une lettre majuscule
.has().lowercase()            // Doit avoir des lettres miniscules
.has().digits(1)              // Doit avoir au moins 1 chiffre
.has().not().spaces()         // Pas d'espace dans le mot de passe



// Insciption d'un utilisateur
exports.signup = (req, res, next) => {
    if(!emailValidator.validate(req.body.email)) {
        throw  "Adresse mail invalide !" 
    } else if (!schemaPasswordValidator.validate(req.body.password)) {
        throw  "Le mot de passe invalide !"
    } else {
        // Crypter le mot de passe
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User ({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }))
            })
            .catch(error => res.status(500).json({ error }))
    };   
};

// Connexion d'utilisateur
exports.login = (req, res, next) => {
    User.findOne({ email : req.body.email })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                              process.env.TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};