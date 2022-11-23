const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: { type : String , required : true, unique : true},
    password: { type : String, required : true}
});

// On ajoute le validator comme plugin à notre schema
userSchema.plugin(uniqueValidator);

// On exporte le modèle utilisateur pour l'utiliser dans d'autres fichiers js
module.exports = mongoose.model('User', userSchema);