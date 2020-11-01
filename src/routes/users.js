const express = require( 'express' );
const { getAllUsers, addUsers } = require( '../controller/users' );
const { authenticate } = require( '../utils/auth' );
const router = express.Router();

router.get( '/', authenticate,  getAllUsers );
router.post( '/addUsers', addUsers );

module.exports = router;