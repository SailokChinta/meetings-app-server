const express = require( 'express' );
const { 
    getMeetingsByFilters, 
    leaveMeetingById,
    addUserForMeetingById
} = require( '../controller/meetings' );

const { authenticate } = require( '../utils/auth' );

const router = express.Router();

router.get( '/', authenticate, getMeetingsByFilters );
router.patch( '/:meeting_id/:action', authenticate, ( req, res, next ) => {
    const action = req.params.action;

    if( action === 'deleteUser' ) {
        leaveMeetingById( req, res, next );
    } else if( action === 'addUser' ) {
        addUserForMeetingById( req, res, next );
    }
});

module.exports = router;