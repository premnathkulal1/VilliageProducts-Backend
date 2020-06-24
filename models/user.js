var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMangoose = require('passport-local-mongoose');

var User = new Schema({
    fullname: {
        type: String,
        default: ''
    },
    adress: {
        type: String,
        default: ''
    },
    facebookId: String,
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMangoose);
module.exports = mongoose.model('User', User);
