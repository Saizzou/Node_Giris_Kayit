const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
});

registrationSchema.methods.authenticate = function(password) {      
    return this.password === password;
  }


registrationSchema.plugin(passportLocalMongoose);
mongoose.model('User', registrationSchema)
module.exports = mongoose.model('User');