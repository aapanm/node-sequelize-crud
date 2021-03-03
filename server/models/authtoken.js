'use strict';

const { Model } = require('sequelize');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  class Authtoken extends Model {
  
    static associate(models) {
      Authtoken.belongsTo(models.User);
    }

    static async generateToken(UserId){
    
      const token = jwt.sign( { id: UserId}, 'thisisjsontoken');
      console.log(token);
      const valid = true;
      return Authtoken.create({ token, valid, UserId })
  
    }

    static async updateTokentoInvalid(UserId, token){
      
      try {

        await Authtoken.update(
          {valid:false},
          {where:{token, UserId}}
        )
        return 'Success';

      } catch (e) {
        return e.message;
      }
    }

    static async getDataUsingToken(token){

      const tokenData = await Authtoken.findOne({where:{token}});
      return tokenData;

    }
  };

  Authtoken.init({
    token: DataTypes.STRING,
    valid: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Authtoken',
  });

  return Authtoken;

};