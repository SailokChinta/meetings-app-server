const express = require( 'express' );
const { getAllUsers } = require( '../controller/users' );
const { authenticate } = require( '../utils/auth' );
const router = express.Router();

router.get( '/', authenticate,  getAllUsers );

module.exports = router;