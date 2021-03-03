'use strict';

const {Model} = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
      User.hasMany(models.Authtoken);
    }

    static async findUserByCredentials(email, password){
      const user = await User.findOne({ where: { email } });
      if(!user) throw new error('Unable to login');

      const isMatch = await bcryptjs.compare(password, user.password);
      if(!isMatch) throw new error('Unable to login');

      return user;
    }

    static async logout(UserId, token){
      
      const  {Authtoken}  = sequelize.models;
      const authToken = await Authtoken.updateTokentoInvalid(UserId, token);
    
      return authToken;
    }

    generatePublicProfile(){
      
      const user = this;

      delete user.dataValues.password;

      return user;

    }

    async authorize(){
      
      const user = this;
      const { Authtoken } = sequelize.models;
      const authtoken = await Authtoken.generateToken(user.dataValues.id);

      return {user: user.generatePublicProfile(), authtoken};
    }

  };

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks:{
      beforeSave: async (user) =>{
        if(user.changed('password')){
          user.password = await bcryptjs.hash(user.password, 8);
        }
      }
    },
    sequelize,
    modelName: 'User',
  });

  return User;
};