const mongoose = require( 'mongoose' );

const Teams = mongoose.model( 'team' );
const Users = mongoose.model( 'user' );

async function getAllTeamsByUserId( req, res, next ) {
    const userId = res.locals.claims.userId;

    try{
        const filter = { members: { $elemMatch: { userId } } };
        const teams = await Teams.find( filter );

        res.json( teams );
    } catch ( error ) {
        error.status = 500;
        error.message = 'Server Side Error';
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

async function addTeams ( req, res, next ) {
    const userId = res.locals.claims.userId;
    const email = res.locals.claims.email;
    const data = req.body;

    const self_user = {
        userId,
        email
    }

    let teams;
    try {
        if( data instanceof Array ) {
            teams = data;
        } else {
            teams = [ data ];
        }

        for ( let i = 0; i < teams.length; i++ ) {
            const membersEmail = teams[i].members;
            delete teams[i].members;

            const validMemberFilter = { email : { $in : membersEmail } };

            let validMember = await Users.find( validMemberFilter ).exec();

            validMember = validMember.map( member => {
                return {
                    userId: member._id.toString(),
                    email: member.email
                }
            });

            teams[i].members = validMember;
        }
        teams.forEach( team => {
            if( !team.members.find( member => member.userId === self_user.userId ) ) {
                team.members.push( self_user );
            }
        });

        const addedTeams = await Teams.insertMany( teams );
        res.status( 201 ).json( addedTeams );
    } catch ( error ) {
        if ( error instanceof mongoose.Error ) {
            error.status = 400;
            error.message = 'Required Fields are missing';
        } else {
            error.status = 500;
            error.message = 'Server Side Error';
        }
        next( error );
    }
}

async function leaveTeamById ( req, res, next ) {
    const userId = res.locals.claims.userId;
    const email = req.query.email;
    const teamId = req.params.team_id;

    try{
        const filters = { $pull : { members: {  } } };

        if( userId ) {
            filters.$pull.members.userId = userId;
        }
        
        if( email ) {
            filters.$pull.members.email = email;
        }
        // console.log( filters );
        const updatedTeam = await Teams.findByIdAndUpdate( teamId, filters );
        res.status( 201 ).json( updatedTeam );
    } catch ( error ) {
        error.status = 404;
        error.message = 'No Team is found with given team id';
        next( error );
    }
}

async function addMembersToTeamById ( req, res, next ) {
    const data = req.body;
    const teamId = req.params.team_id;
    let members, validMembers = [];
    try {
        if( data instanceof Array ) {
            members = data;
        } else {
            const error = new Error( 'Request Body is expecting an Array' );
            error.status = 400;
            next( error );
            return;
        }

        const memberFilter = { email: { $in: members } };
        validMembers = await Users.find( memberFilter ).exec();

        validMembers = validMembers.map( member => {
            return {
                userId: member._id.toString(),
                email: member.email,
            }
        });

        addMemberFilter = { $addToSet: { members: validMembers } };
        
        const updatedTeams = await Teams.findByIdAndUpdate( teamId, addMemberFilter, { runValidators: true } );
        res.status( 201 ).json( updatedTeams );
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

async function editTeamDetailsById ( req, res, next ) {
    const data = req.body;
    const teamId = req.params.team_id;

    let teams;
    try {
        if( data instanceof Array ) {
            const error = new Error( 'Request Body is expecting an Object' );
            error.status = 400;
            next( error );
            return;
        } else if ( Object.keys( data ).length === 0 ) {
            const error = new Error( 'Required fields are missing' );
            error.status = 400;
            next( error );
            return;
        } else {
            teams = data;
        }

        const teamDetailsFilter = { $set: {  } };
        teamDetailsFilter.$set = data;       
        const updatedTeams = await Teams.findByIdAndUpdate( teamId,  teamDetailsFilter, { runValidators: true } );

        res.status( 201 ).json( updatedTeams );
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
    getAllTeams,
    getAllTeamsByUserId,
    addTeams,
    leaveTeamById,
    addMembersToTeamById,
    editTeamDetailsById,
}