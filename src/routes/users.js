const express = require( 'express' );
const { getAllUsers } = require( '../controller/users' );

const router = express.Router();

router.get( '/', getAllUsers );

module.exports = router;