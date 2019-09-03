const mongoose = require('mongoose');

const Notification = new mongoose.Schema ({
   accountId: { type: String, required: true, unique: true },
    name: { type: String },
    color: { type: String }
});


module.exports = mongoose.model('Notification', Notification);