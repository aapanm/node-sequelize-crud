
const express = require('express');
const Route = express.Router();
const auth = require('../middleware/auth');
const faker = require('faker');


const db = require('../models/index');
const User = require('../models/user')(db.sequelize, db.Sequelize);

Route.post('/signup', async (req, res) => {
    
    
        try {

            for(let i = 0; i < 10; ++i){
                
                const data = {};

                data.name = faker.name.findName();
                data.email = faker.internet.email();
                data.password = faker.internet.password();
        
                const user = User.build(data);
                // const user = User.build(req.body);

                await user.save();

            }

            // res.status(200).send({user: user.generatePublicProfile()});
            res.status(200).send({msg:'Success!'});
            

        } catch (e) {

            res.status(400).send(e.message);
        }

})

Route.post('/signin', async (req, res) => {

    try {

        const user = await User.findUserByCredentials(req.body.email, req.body.password);
        const authorizeUser = await user.authorize();

        res.status(200).send(authorizeUser);

    } catch (e) {

        res.status(400).send(e.message);
    }

})

Route.post('/signout', auth, async (req, res) => {
    try{
        const UserId = req.UserId;
        const token = req.token;
        
        const logout = await User.logout(UserId, token);

        res.status(200).send({msg: logout + 'logged out!' });
        
    }catch(e){
        res.status(400).send(e.message);
    }
})

module.exports = Route;