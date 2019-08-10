const express = require("express");
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

//connecting to db
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/crud-mongo',{ useNewUrlParser: true })
    .then(db => console.log('DB connected'))
    .catch(err => console.log(err));

// importing routes
const indexRoutesUser = require('./routes/user.routes');

//setting
app.set('port',process.env.PORT  || 3000);

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({origin:'http://localhost:4200'}));

//routes
app.use('/User',indexRoutesUser);

//starting the server
app.listen(app.get('port'),() =>{
    console.log('Its ON in '+app.get('port'));
});