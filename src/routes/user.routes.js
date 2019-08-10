const express = require('express');
const router = express.Router();
const User = require('../models/user');
const user = require('../controllers/user.controller');

router.post('/', user.authenticateUser);

router.get('/:id',ensureToken, user.getUser);

router.put('/:id',ensureToken, user.editUser);

router.delete('/:id',ensureToken, user.deletetUser);

router.get('/',ensureToken, user.getUsers);

router.post('/add',ensureToken, user.createUser);

function ensureToken(req,res,next){
    const bearerHeaders = req.headers.authorization;
    if(typeof bearerHeaders !== 'undefined'){
        const bearer = bearerHeaders.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next(); 
    }
    else{
        res.status(404).send('there is not a token');
    }
}

module.exports = router;
