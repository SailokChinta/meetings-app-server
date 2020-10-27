const mongoose = require( 'mongoose' );

const Meetings = mongoose.model( 'meeting' );

async function getMeetingsByFilters ( req, res, next ) {
    const date = req.query.date;
    const search = req.query.search;
    const userId = res.locals.claims.userId;
    const email = req.query.email;
    const period = req.query.period;

    try {
        const filter = { date: { }, attendees: { $elemMatch: { } }, description: { } };

        if( userId ) {
            filter.attendees.$elemMatch.userId = userId;
        }

        if( email ) {
            filter.attendees.$elemMatch.email = email;
        }

        if( search ) {
            filter.description = { $regex: new RegExp( search, 'i' ) };
        } else {
            delete filter.description;
        }

        const today = new Date();

        switch( period ) {
            case 'PAST': 
                filter.date = { $lt: today };
                break;
            case 'TODAY':
                filter.date = { $eq: today };
                break;
            case 'UPCOMING':
                filter.date = { $gt: today };
                break;
            default:
                delete filter.date;
        }

        if( date ) {
            filter.date = { $eq: date };
        }

        const meetings = await Meetings.find( filter );
        res.status( 200 ).json( meetings );
    } catch ( error ) {
        if( error.message.includes( 'Cast to' ) ) {
            error.status = 400;
        } else {
            error.status = 500;
        }
        next( error );
    }
}

async function leaveMeetingById ( req, res, next ) {
    const userId = res.locals.claims.userId;
    const email = req.query.email;
    const meeting_id = req.params.meeting_id;

    try{
        const filter = { $pull: { attendees: {  } } };

        if( userId ) {
            filter.$pull.attendees.userId = userId;
        }

        if( email ) {
            filter.$pull.attendees.email = email;
        }

        const updatedMeetings = await Meetings.findByIdAndUpdate( meeting_id, filter );
        res.status( 201 ).json( updatedMeetings );
    } catch( error ) {
        error.status = 404;
        next( error );
    }
}

async function addUserForMeetingById ( req, res, next ) {
    const meeting_id = req.params.meeting_id;
    const data = req.body;
    let attendees;
    try{
        const filter = { $addToSet: { attendees: {  } } };

        if( data instanceof Array ) {
            attendees = data;
        } else {
            attendees = [ data ];
        }

        filter.$addToSet.attendees = attendees;
        const updatedMeetings = await Meetings.findByIdAndUpdate( meeting_id, filter, { runValidators: true } );
        res.status( 201 ).json( updatedMeetings );
    } catch( error ) {
        error.status = 400;
        next( error );
    }
}

module.exports = {
    getMeetingsByFilters,
    leaveMeetingById,
    addUserForMeetingById
}