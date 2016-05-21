/**
 * Created by paulomarinho on 02/05/16.
 */
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

module.exports = {
  secret: sails.config.jwtSettings.secret,
  issuer: sails.config.jwtSettings.issuer,
  audience: sails.config.jwtSettings.audience,

  /**
   * criptografa a senha recebida
   */
  hashPassword: function (user) {
    if (user.password) {
      user.password = bcrypt.hashSync(user.password);
    }
  },

  /**
   * Compara a senha recebida com a do banco, usando o hash
   * @returns boolean indicating a match
   */
  comparePassword: function(password, user){
    return bcrypt.compareSync(password, user.password);
  },

  /**
   * Cria um token para o usuario
   * @param user
   */
  createToken: function(user)
  {
    return jwt.sign({
        user: user.toJSON()
      },
      sails.config.jwtSettings.secret,
      {
        algorithm: sails.config.jwtSettings.algorithm,
        //expiresInMinutes: sails.config.jwtSettings.expiresInMinutes,
        issuer: sails.config.jwtSettings.issuer,
        audience: sails.config.jwtSettings.audience
      }
    );
  }
};