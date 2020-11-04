const mongoose = require( 'mongoose' );

const Users = mongoose.model( 'user' );
const Meetings = mongoose.model( 'meeting' );
const Teams = mongoose.model( 'team' );

async function getAllUsers ( req, res, next ) {
    try {
        let users = await Users.find().select( [ '-password' ] );
        res.json( users );
    } catch ( error ) {
        error.status = 500;
        next( error );
    }
}

async function getAllTeams( req, res, next ) {
    try{
        const teams = await Teams.find();
        res.json( teams );
    } catch ( error ) {
        error.status = 500;
        error.message = 'Server Side Error';
        next( error );
    }
}

async function getAllMeetings ( req, res, next ) {
    try {
        let users = await Meetings.find();
        res.json( users );
    } catch ( error ) {
        error.status = 500;
        next( error );
    }
}

module.exports = {
    getAllUsers,
    getAllTeams,
    getAllMeetings
}