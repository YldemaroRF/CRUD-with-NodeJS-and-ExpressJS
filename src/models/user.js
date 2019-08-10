const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt-nodejs');


const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
});

userSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(10,(err,salt) =>{
        if(err) next(err);

        bcrypt.hash(user.password,salt,null,(err,hash)=>{
            if(err) next(err);
            user.password = hash;
            next();
        });
    });
});


module.exports = mongoose.model('users',userSchema);