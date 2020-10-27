const express = require( 'express' );
const { 
    getMeetingsByFilters, 
    leaveMeetingById,
    addUsersForMeetingById,
    addMeetings
} = require( '../controller/meetings' );

const { authenticate } = require( '../utils/auth' );

const router = express.Router();

router.get( '/', authenticate, getMeetingsByFilters );
router.patch( '/:meeting_id/:action', authenticate, ( req, res, next ) => {
    const action = req.params.action;

    if( action === 'deleteUser' ) {
        leaveMeetingById( req, res, next );
    } else if( action === 'addUser' ) {
        addUsersForMeetingById( req, res, next );
    }
});
router.post( '/add', authenticate, addMeetings );
module.exports = router;