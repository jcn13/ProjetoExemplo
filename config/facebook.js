/* config/facebook.js*/
'use strict';

var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  request = require('request');


var verifyHandler = function(req, token, tokenSecret, profile, done, next) {
  console.log('verifyHandler');

  /*antes de evoluir, pegando o email do usuario */
  var data = {};

    var url = 'https://graph.facebook.com/v2.4/me?access_token=%s&fields=id,name,email,first_name,last_name,gender';
    url = url.replace('%s', token);

    var options = {method: 'GET', url: url, json: true};
    request(options, function (err, response) {
      if (err) {
        console.log('erro graph');
        return done(null, null);
      }

      var data = {
        id: response.body.id,
        first_name: response.body.first_name,  //jshint ignore:line
        last_name: response.body.last_name,    //jshint ignore:line
        email: response.body.email,
        gender: response.body.gender
      };
      console.log(JSON.stringify(data));

      //Agora criando ou alterando nosso usuario

      console.log('email='+data.email);
      User.findOrCreate(
        { email: data.email },{
          email: data.email,
          facebookid: data.id,
          username : data.first_name,
          firstName :data.first_name,
          lastName: data.last_name,
          facebooktoken: token,
          facebooksecret: tokenSecret
      })
        .exec(function (error, usr) {
          //erro geral, retorna erro
          if (error){
            console.log('error');
            //return next(error, false, {});
          }

          console.log('saindo');
          //encontrou, nao faz nada no caso

          return next(usr, false, {});
        });
      //return done(null, data);
    });
};

passport.use(new FacebookStrategy({
  clientID: '236529686716119',
  clientSecret: 'd2ee8f033896950fb3b7e869ba96b60c',
  callbackURL: 'http://localhost:1337/auth/facebook/callback',
  passReqToCallback: true
}, verifyHandler));