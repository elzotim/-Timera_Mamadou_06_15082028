// Importer les modules natifs et externes
const fs = require('fs');
const Sauce = require('../models/sauce');

// Récuperer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json( {error }));
};

// Récuperer une sauce 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id : req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []      
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée avec succès !' }))
        .catch(error => res.status(400).json({ error }));
};

// Modifier une sauce 
exports.modifySauce = (req, res, next) => {
    if(req.file) { // Si l'image est modifiée, on supprime l'ancienne image dans /image
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    const sauceObject = 
                    {   
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée avec succès !' }))
                        .catch(error => res.status(400).json({ error }))
                });
            });
    } else { // Si l'image n'est pas modifée
        const sauceObject = { ...req.body } 
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée avec succès !' }))
            .catch(error => res.status(400).json({ error }))
    }
};

// Supprimer une sauce 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if(!sauce){ // Si sauce n'existe pas
                res.status(404).json({ 
                    error: new Error('Sauce inexistante')
                });
            }
            if(sauce.userId !== req.auth.userId){ // Si sauce userId est différent de auth userId
                res.status(401).json({ 
                    error : new Error('Demande non autorisée')
                });
            }
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée avec succès !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

/**
 * 
 * @param {Object} req la requête
 * @param {Object} res le resultat 
 * @param {*} next le middleware
 */
exports.statusLikedSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    Sauce.findOne({ _id: sauceId })
        .then(sauce => {
            // On crée nouveau objet à modifier
            const newObjectStatusSauce = {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                likes: 0,
                dislikes: 0
            }
            switch (like) {
                case 1: // Cas si l'utilisateur aime (like) la sauce
                    newObjectStatusSauce.usersLiked.push(userId);
                    break;
                case 0: // Cas si l'utilisateur annule son like ou dislike
                    if(newObjectStatusSauce.usersLiked.includes(userId)) { // Si userId est dans usersLiked
                        // On récupère l'index d'userId
                        const indexUserId = newObjectStatusSauce.usersLiked.indexOf(userId);
                        // On supprime userId dans le tableau à partir de l'indexUserId
                        newObjectStatusSauce.usersLiked.splice(indexUserId, 1);
                    } else { // Si userId est dans usersDisliked
                        // On récupère l'index d'userId
                        const indexUserId = newObjectStatusSauce.usersDisliked.indexOf(userId);
                        // On supprime userId dans le tableau à partir de l'indexUserId
                        newObjectStatusSauce.usersDisliked.splice(indexUserId, 1);
                        
                    }
                    break;
                case -1: // Cas si l'utilisateur n'aime pas (dislike) la sauce
                    newObjectStatusSauce.usersDisliked.push(userId);
                    break;
                default:
                    break;
            };
            console.log(like);
            newObjectStatusSauce.likes = newObjectStatusSauce.usersLiked.length; // Nombre total de like
            newObjectStatusSauce.dislikes = newObjectStatusSauce.usersDisliked.length; // Nombre total de dislike
            Sauce.updateOne({ _id: sauceId}, newObjectStatusSauce)
                .then(() => res.status(200).json({ message: 'Sauce notée !' }))
                .catch(error => res.status(400).json({ error })); 
        })
       .catch(error => res.status(500).json({ error }));
};

