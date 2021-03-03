const jwt = require('jsonwebtoken');
const db = require('../models/index');
const {Authtoken} = db.sequelize.models

const Auth = async (req, res, next) =>{

    try {

        console.log(req.header('Authorization'));
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisisjsontoken');

        const authtokenData = await Authtoken.getDataUsingToken(token);

        console.log(authtokenData);

        if(decoded.id == authtokenData.dataValues.id && authtokenData.dataValues.valid){
            req.UserId = decoded.id;
            req.token = token;
        }else{
            throw new error('Something went wrong!');
        }

        next();

    } catch (e) {
        res.send(e.message);
    }
}

module.exports = Auth;