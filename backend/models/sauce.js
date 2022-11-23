const mongoose = require('mongoose');


const sauceSchema = mongoose.Schema({
    userId: { type: String, trim: true, required: true },
    name: { type: String, trim: true, required: true, minLength: 3, maxLength: 100 },
    manufacturer: { type: String, trim: true, required: true, minLength: 3, maxLength: 100 },
    description: { type: String, trim: true, required: true, minLength: 3, maxLength: 1000 },
    mainPepper: { type: String, trim: true, required: true, minLength: 3, maxLength: 100 },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true, min: 1, max: 10 },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true } 
});


module.exports = mongoose.model('Sauce', sauceSchema);