const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' );

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    dbName: {
        type: String,
        required: true
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [ roleSchema ]
}, { versionKey: false });

// email should follow this pattern
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
userSchema.path( 'email' ).validate( email => emailRegex.test( email.toLowerCase() ), 'Invalid email id format' );

const SALT_FACTOR = 10;

// generating salt and hashing the password before saving. pre is a lifecycle hook
userSchema.pre( 'save', function( done ) {
    const user = this;

    bcrypt.genSalt( SALT_FACTOR, ( err, salt ) => {
        if ( err ) {
            done( err );
        }

        bcrypt.hash( user.password,  salt, ( err, hashedPassword ) => {
            if( err ) {
                done( err );
            }

            user.password = hashedPassword;
            done();
        });
    });
});

userSchema.pre( 'insertMany', function( done, users ) {
    bcrypt.genSalt( SALT_FACTOR, ( err, salt ) => {
        if ( err ) {
            done( err );
        }
        
        users.map( user  => {
            bcrypt.hash( user.password,  salt, ( err, hashedPassword ) => {
                if( err ) {
                    done( err );
                }
    
                user.password = hashedPassword;
                done();
            });
        });
    });
});

// userSchema.methods.checkPassword = async function( password, next ) {
//     try {
//         const x = await bcrypt.compare( password, this.password );
//         console.log( x );
//         return x;
//     } catch ( error ) {
//         error.status = 500;
//         next( error );
//     }
// };

userSchema.methods.checkPassword = function ( password ) {
    return bcrypt.compareSync( password, this.password );
};

mongoose.model( 'user', userSchema );