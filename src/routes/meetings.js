const express = require( 'express' );
const { 
    getMeetingsByFilters, 
    leaveMeetingById,
    addUserForMeetingById
} = require( '../controller/meetings' );

const router = express.Router();

router.get( '/', getMeetingsByFilters );
router.patch( '/:meeting_id/:action', ( req, res, next ) => {
    const action = req.params.action;

    if( action === 'deleteUser' ) {
        leaveMeetingById( req, res, next );
    } else if( action === 'addUser' ) {
        addUserForMeetingById( req, res, next );
    }
});

module.exports = router;