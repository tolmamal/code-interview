const mongoose = require('mongoose');

const Account = new mongoose.Schema ({
    email: {type: String, required: true, unique: true},
    name: {type: String},
    age: {type: Number},

}, {timestamp: true});

module.exports = mongoose.model('Account', Account);