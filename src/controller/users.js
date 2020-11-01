const mongoose = require( 'mongoose' );

const Users = mongoose.model( 'user' );

async function getAllUsers ( req, res, next ) {
    try {
        const users = await Users.find().select( [ 'name', 'email' ] );
        res.json( users );
    } catch ( error ) {
        error.status = 500;
        next( error );
    }
}

async function addUsers ( req, res, next ) {
    const data = req.body;
    let users;
    try {
        if( data instanceof Array ) {
            users = data;
        } else {
            users = [ data ];
        }

        const addedUsers = await Users.insertMany( users );
        res.status( 201 ).json({});
    } catch ( error ) {
        console.log( error );
        if( error instanceof mongoose.Error ) {
            error.status = 400;
            error.message = 'Required Fields are missing';
        } else {
            error.status = 500;
            error.message = 'Server Side Error';
        }
        next( error );
    }
}

module.exports = {
    getAllUsers,
    addUsers
}