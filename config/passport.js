/**
 * Passport configuration file where you should configure strategies
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

//tempo de expiração do token
var EXPIRES_IN_MINUTES = 60 * 24;
//segredo para criptografia
var SECRET = process.env.tokenSecret || "4ukI0uIVnB3iI1yxj646fVXSE3ZVk4doZgz6fTbNg7jO41EAtl20J5F7Trtwe7OM";
//tipo de criptografia
var ALGORITHM = "HS256";
//audiencia do sistema
var ISSUER = "infnet.edu.br";
var AUDIENCE = "infnet.edu.br";

/**
 * Configuração local de autenticação
 */
var LOCAL_STRATEGY_CONFIG = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false
};

/**
 * Configuração para autenticação JWT
 */
var JWT_STRATEGY_CONFIG = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: SECRET,
  issuer : ISSUER,
  audience: AUDIENCE,
  passReqToCallback: false
};

/**
 * Triggers para autenticar localmente
 */
function _onLocalStrategyAuth(email, password, next) {
  //encontrar usuario pelo email
  User.findOne({email: email})
    .exec(function (error, user) {
      //retorna erro
      if (error) return next(error, false, {});
      //usuario nao encontrado
      if (!user) return next(null, false, {
        code: 'E_USER_NOT_FOUND',
        message: email + ' is not found'
      });
      //se encontrado, verifica a senha
      // TODO: replace with new cipher service type
      if (!CipherService.comparePassword(password, user))
        return next(null, false, {
          code: 'E_WRONG_PASSWORD',
          message: 'Password is wrong'
        });
      //sem erro, retorna o usuario
      return next(null, user, {});
    });
}

/**
 * Triggers para autenticar via JWT
 */
function _onJwtStrategyAuth(payload, next) {
  var user = payload.user;
  return next(null, user, {});
}

///dizendo o que usaremos
passport.use(
  new LocalStrategy(LOCAL_STRATEGY_CONFIG, _onLocalStrategyAuth));
passport.use(
  new JwtStrategy(JWT_STRATEGY_CONFIG, _onJwtStrategyAuth));

///agora sim, exportando para o NodeJS em si utilizar a conf do JWT
//PM 2/5/16 - expireinminutes nao funciona mais na exportacao
module.exports.jwtSettings = {
  //expiresInMinutes: EXPIRES_IN_MINUTES,
  secret: SECRET,
  algorithm : ALGORITHM,
  issuer : ISSUER,
  audience : AUDIENCE
};