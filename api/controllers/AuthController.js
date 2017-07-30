/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');
// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');

module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

    login: function(req, res) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return res.serverError({
                    success: false,
                    message: err
                });
            }

            if (!user) {
                return res.notFound({
                    success: false,
                    message: info.message
                });
            }

            req.logIn(user, function(err) {
                if (err) {
                    return res.serverError({
                        success: false,
                        message: err
                    });
                }

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, sails.config.applications.JSON_WEB_TOKEN.SECRET_PRIVATE_KEY, {
                    expiresIn: 1440 // expires in 24 hours
                });

                // disable session when using passport
                req.logout();

                return res.ok({
                    success: true,
                    message: info.message,
                    token: token
                });
            });

        })(req, res);
    }
};