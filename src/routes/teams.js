const express = require( 'express' );
const { 
    getAllTeamsByUserId,
    getAllTeams,
    addTeams,
    leaveTeamById,
    addMembersToTeamById,
    editTeamDetailsById,
 } = require( '../controller/teams' )
const { authenticate } = require('../utils/auth');

const router = express.Router();

router.get( '/', authenticate, getAllTeamsByUserId );
router.get( '/all', authenticate, getAllTeams );
router.post( '/add', authenticate, addTeams );
router.patch( '/:team_id/:action', authenticate, ( req, res, next ) => {
    const action = req.params.action;

    if( action === 'deleteMember' ) {
        leaveTeamById( req, res, next );
    } else if ( action === 'addMember' ) {
        addMembersToTeamById( req, res, next );
    } else if( action === 'editDetails' ) {
        editTeamDetailsById( req, res, next );
    }
});

module.exports = router;