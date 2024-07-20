const express=require('express');
const app=express();
require('dotenv').config();
require('./db')

const auth=require('./routes/auth')
const user=require('./routes/userController')

const bodyParser=require('body-parser');
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use("/api/auth",auth); 
app.use("/api/userController",user);

app.listen(PORT, ()=>{
    console.log('Listening on port '+PORT)
})

