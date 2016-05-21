/**
 * User
 * @description :: Model for storing users
 */
module.exports = {
  schema: true,
  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true,
      alphanumericdashed: true
    },
    password: {
      type: 'string'
    },
    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },
    firstName: {
      type: 'string',
      defaultsTo: ''
    },
    lastName: {
      type: 'string',
      defaultsTo: ''
    },
    photo: {
      type: 'string',
      defaultsTo: '',
      url: true
    },
    socialProfiles: {
      type: 'object',
      defaultsTo: {}
    },
    facebookid: {
      type: 'string'
    },
    facebooktoken: {
      type: 'string'
    },
   
    

    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      delete obj.socialProfiles;
      return obj;
    }
  },
  //ao editar, hash na senha
  beforeUpdate: function (values, next) {
    CipherService.hashPassword(values);
    next();
  },
  //ao criar, hash na senha
  beforeCreate: function (values, next) {
    CipherService.hashPassword(values);
    next();
  }
};