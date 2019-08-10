const userCtrl = {};
const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const moment = require('moment');

userCtrl.authenticateUser = async (req,res) =>{
    const user = new User(req.body);
    console.log(req.body);
    
    await User.findOne({email:user.email},(err,response)=>{
        if(!err){
            if(response == null) res.status(400).send({message:'este usuario no existe'});
            else{
                bcrypt.compare(user.password,response.password,(err,response) =>{
                    if(!response) res.status(400).send({message:'contraseña incorrecta'});
                    else{
                        const token = jwt.sign(createToken(user),'my_secret_key');
                        res.json({
                            token:token
                        })
                    }
                });
            }
        }
        else res.status(400).send(err);
    });
}

userCtrl.getUser = async (req,res) =>{
    const { id } = req.params;
    jwt.verify(req.token,'my_secret_key',(err,data)=>{
        if(err) res.status(400).send('token does not exit')
    }); 
    User.findById(id,(err,response)=>{
        if(!err){
            const dataUser = GetUserData(response);
            res.status(200).send(dataUser);
        }
        else{
            res.status(400).send(err);
        }
    });
}

userCtrl.editUser = async (req,res) =>{
    const { id } = req.params;
    const user = new User(req.body);
    jwt.verify(req.token,'my_secret_key',(err,data)=>{
        if(err) res.status(400).send('token does not exit')
    }); 

    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt) =>{
            if(err) res.status(400).send(er);
            else{
                bcrypt.hash(user.password,salt,null,(err,hash)=>{
                    if(err) res.status(400).send(err);;
                    req.body.password = hash;
                    User.updateOne({_id:id},req.body,(err,response)=>{
                        if(!err) res.status(200).send(response);
                        else{
                            res.status(400).send(response);
                        }
                    });
                });
            }
        });
    }
    else{
        User.updateOne({_id:id},req.body,(err,response)=>{
            if(!err) res.status(200).send(response);
            else{
                res.status(400).send(response);
            }
        });
    }
}

userCtrl.deletetUser = async(req,res) =>{
    jwt.verify(req.token,'my_secret_key',(err,data)=>{
        if(err) res.status(400).send('token does not exit')
    }); 
    const { id } = req.params;
    await User.remove({_id:id},(err,response)=>{
        if(!err) res.status(200).send("deleted");
        else{
            res.status(400).send(response);
        }
    });
}

userCtrl.getUsers = async (req,res,next) =>{ 
    await User.find((err,response)=>{
        if(!err){
            const dataUsers = [];
            for(var i = 0;i < response.length;i++){
                dataUsers.push(GetUserData(response[i]));
            }
            res.status(200).send(dataUsers);
        } 
        else{
            res.status(400).send(err);
        }
    });
}

userCtrl.createUser = async (req,res) =>{
    jwt.verify(req.token,'my_secret_key',(err,data)=>{
        if(err) res.status(400).send('token does not exit')
    }); 
    const user = new User(req.body);
    await user.save((err,response)=> {
        if (!err) res.status(200).send(response);    
        else res.status(400).send(err);
    });
}

function GetUserData(user){
    let data = {
        firstName: user.firstName,
        lastName: user.lastName,
        email:user.email,
        rol:'Admin'
    };
     return data;
}

function createToken(user){
    const data = {  
        sub: user.email,
        iat : moment().unix(),
        exp: moment().add(24,'hours').unix()
    }
    return data;
}

module.exports = userCtrl;