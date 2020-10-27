const mongoose = require( 'mongoose' );
const jwt = require( 'jsonwebtoken' );

const User = mongoose.model( 'user' );

async function sendToken( req, res, next ) {
    const { email, password } = req.body;

    try {
        if( email && password ) {
            const user = await User.findOne( { email }, { email: 1, password: 1 } );
            if ( user ) {
                if( user.email === email && user.password === password ) {
                    const claims = {
                        userId: user._id,
                        email: user.email
                    } 
                    jwt.sign( claims, 'key', { expiresIn: '24h' }, ( err, token ) => {
                        if( err ) {
                            const error = new Error( 'Error in Authentication' );
                            error.status = 500;
                            next( error );
                            return;
                        }

                        res.json({ token });
                    });
                } else {
                    const error = new Error( 'Username and Password do not match' );
                    error.status = 400;
                    next( error );
                }
            } else {
                const error = new Error( 'No User found with given email id' );
                error.status = 404;
                next( error );
            }
        } else {
            const error = new Error( 'Login credentials are missing' );
            error.status = 400
            next( error );
        }
    } catch( error ) {
        error.status = 500;
        next( error );
    }
}

module.exports = {
    sendToken
}