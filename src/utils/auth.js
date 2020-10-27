const jwt = require( 'jsonwebtoken' );

function authenticate( req, res, next ) {
    const token = req.header( 'authorization' );

    if( !token ) {
        const error = new Error( 'Auth token is not provided' );
        error.status = 401;
        next( error );
        return;
    }

    jwt.verify( token, 'key', ( err, claims ) => {
        if( err ) {
            const error = new Error( 'Could not able to verify token' );
            error.status = 403;
            next( error );
            return;
        }

        res.locals.claims = claims;
        next();
    });
}

module.exports = {
    authenticate
}