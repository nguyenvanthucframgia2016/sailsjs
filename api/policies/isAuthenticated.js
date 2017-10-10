var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    try {
        // check header or url parameters or post parameters for token
        var token = '';
        if (req.body.token) {
            token = req.body.token;
        }

        if (req.query && req.query.token) {
            token = req.query.token;
        }

        if (req.headers && req.headers['x-access-token']) {
            token = req.headers['x-access-token'];
        }

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, sails.config.applications.JSON_WEB_TOKEN.SECRET_PRIVATE_KEY, function(err, decoded) {
                if (err) {
                    sails.log.error(err);

                    return res.ok({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                }

                return next();
            });

        } else {
            // if there is no token
            // return an error
            return res.forbidden({
                success: false,
                message: 'No token provided.'
            });
        }
    } catch (err) {
        sails.log.error(err);

        return res.serverError({
            success: false,
            message: 'Server error'
        });
    }
}