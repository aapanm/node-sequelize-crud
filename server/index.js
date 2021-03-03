
const express = require('express');
const path = require('path');
const db = require('./models/index');
const userRoute = require('./Routes/user.routes');

const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(userRoute);

async function sync(){
    try {
        await db.sequelize.sync({force:true});
    } catch (e) {
        console.log(e.message);
    }
}

async function init(){
    await sync();
    app.listen(port, ()=>{
        console.log('Server is up on port '+ port);
    })
}

init();