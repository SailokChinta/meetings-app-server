const express = require( 'express' );
const { sendToken } = require( '../controller/auth' )

const router = express.Router();

router.post( '/login', sendToken );

module.exports = router;