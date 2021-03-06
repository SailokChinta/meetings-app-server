const mongoose = require( 'mongoose' );
const jwt = require( 'jsonwebtoken' );

const User = mongoose.model( 'user' );

const ADMIN = 'ADMIN';

async function sendToken( req, res, next ) {
    const { email, password } = req.body;
    try {
        if( email && password ) {
            const user = await User.findOne( { email } );
            if ( user ) {                
                if( user.email === email && user.checkPassword( password ) ) {
                    const isAdmin = !!user.roles.find( role => role.role === ADMIN );
                    const claims = {
                        userId: user._id,
                        email: user.email,
                        isAdmin
                    } 

                    const roles = user.roles.map( role => role.role );

                    jwt.sign( claims, 'key', { expiresIn: '24h' }, ( err, token ) => {
                        if( err ) {
                            const error = new Error( 'Error in Authentication' );
                            error.status = 500;
                            next( error );
                            return;
                        }
                        
                        res.json({ name: user.name, email: user.email, roles, token });
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
        error.message = 'Server Side error.'
        error.status = 500;
        next( error );
    }
}

module.exports = {
    sendToken
}