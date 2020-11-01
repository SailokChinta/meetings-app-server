const { response } = require('express');
const mongoose = require( 'mongoose' );

const Meetings = mongoose.model( 'meeting' );
const Users = mongoose.model( 'user' );
const Teams = mongoose.model( 'team' );

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

        const today = new Date( new Date().toISOString().substring( 0, 10 ) );

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

        const meetings = await Meetings.find( filter ).sort( { date: -1 } );
        res.status( 200 ).json( meetings );
    } catch ( error ) {
        if( error instanceof mongoose.Error ) {
            error.status = 400;
            error.message = 'Required fields are missing with proper format';
        } else {
            error.status = 500;
            error.message = 'Server Side Error';
        }
        next( error );
    }
}

async function leaveMeetingById ( req, res, next ) {
    const userId = res.locals.claims.userId;
    const email = req.query.email;
    const meetingId = req.params.meeting_id;

    try{
        const filter = { $pull: { attendees: {  } } };

        if( userId ) {
            filter.$pull.attendees.userId = userId;
        }

        if( email ) {
            filter.$pull.attendees.email = email;
        }

        const updatedMeetings = await Meetings.findByIdAndUpdate( meetingId, filter );
        res.status( 201 ).json( updatedMeetings );
    } catch( error ) {
        error.status = 404;
        error.message = 'No Meeting found with given meeting id';
        next( error );
    }
}

async function addUsersForMeetingById ( req, res, next ) {
    const meeting_id = req.params.meeting_id;
    const data = req.body;
    let attendees;
    try{
        const filter = { $addToSet: { attendees: {  } } };

        if( data instanceof Array ) {
            attendees = data;
        } else {
            const error = new Error( 'Request Body is expecting an Array' );
            error.status = 400;
            next( error );
            return;
        }

        const attendeeFilter = { email: { $in: attendees } };
        let validAttendees = await Users.find( attendeeFilter, { email: 1 } ).exec();

        validAttendees = validAttendees.map( attendee => {
            return {
                userId: attendee._id.toString(),
                email: attendee.email
            }
        });

        filter.$addToSet.attendees = validAttendees;
        const updatedMeetings = await Meetings.findByIdAndUpdate( meeting_id, filter, { runValidators: true } );
        res.status( 201 ).json( updatedMeetings );
    } catch( error ) {
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

async function addMeetings ( req, res, next ) {
    const userId = res.locals.claims.userId;
    const email = res.locals.claims.email;
    const data = req.body;

    const self_user = {
        userId,
        email
    };

    let meetings;
    try {
        if ( data instanceof Array ) {
            meetings = data;
        } else {
            meetings = [ data ];
        }

        for ( let i = 0; i < meetings.length; i++ ) {
            const attendeesEmail = meetings[i].attendees;
            delete meetings[i].attendees;
            
            const attendeeFilter = { email: { $in: attendeesEmail } };
            let validUserAttendees = await Users.find( attendeeFilter, { email: 1 } ).exec();

            const validAttendees = validUserAttendees.map( attendee => {
                return {
                    userId: attendee._id.toString(),
                    email: attendee.email
                }
            });

            const teamShortNames = meetings[i].teams;
            delete meetings[i].teams;

            const teamFilter = { shortName: { $in: teamShortNames } };
            validTeamAttendees = await Teams.find( teamFilter, { members: 1, _id: 0 } ).exec();

            validTeamAttendees.forEach( attendee => {
                const users = attendee.members;
                users.forEach( user => {
                    // user is not present in validattendees
                    if ( !validAttendees.find( validAttendee => validAttendee.userId === user.userId.toString() ) ) {
                        validAttendees.push({ 
                            userId: user.userId.toString(), 
                            email: user.email
                        });
                    }
                });
            });
            meetings[i].attendees = validAttendees;
        }
        
        meetings.forEach( meeting => {
            if( !meeting.attendees.find( attendee => attendee.userId === self_user.userId ) ) {
                meeting.attendees.push( self_user );
            }
        });
        
        const addedMeetings = await Meetings.insertMany( meetings );
        res.status( 201 ).json( addedMeetings );
    } catch ( error ) {
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
    getMeetingsByFilters,
    leaveMeetingById,
    addUsersForMeetingById,
    addMeetings
}