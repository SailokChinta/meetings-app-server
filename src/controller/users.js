const mongoose = require( 'mongoose' );

const Users = mongoose.model( 'user' );

async function getAllUsers ( req, res, next ) {
    try {
        const users = await Users.find();
        res.json( users );
    } catch ( error ) {
        error.status = 500;
        next( err );
    }
}

module.exports = {
    getAllUsers
}