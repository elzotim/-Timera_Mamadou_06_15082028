// Impoter le module multer
const multer = require('multer');

// Dictionnaire MIME_TYPES qui sera un objet
const MIME_TYPES = {
    'images/jpg' : 'jpg',
    'images/jpeg': 'jpg',
    'images/png' : 'png'
};

// Création de configuration pour multer - diskStorage => veut dire qu'on enregistre sur le disque
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // null pour dire qu'il n'ya pas eu d'erreur et images pour la destination
        callback(null, 'images')
    },
    filename: (req, file, callback) => { // filename expliquera à multer quel nom de fichier il faut utiliser
        // Génerer le nom, s'il ya espace dans le nom de fichier ça peut créer des problèmes au niveau serveur donc on split
        const nameWithExtension= file.originalname.split(' ').join('_');
        const name = nameWithExtension.split('.')[0];
        const extension = nameWithExtension.split('.')[1];
        //const name = file.originalname.split(' ').join('_');
        //const extension = MIME_TYPES[file.mimetype];
        //const name = file.originalname.split(".")[0].split(" ").join("_");
        //const extension = MIME_TYPES[file.mimetype];
        callback(null, name + '_' + Date.now() + '.' + extension);
    }
});

// Exporter multer configuré
module.exports = multer({ storage  }).single('image');