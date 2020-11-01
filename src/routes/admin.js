const express = require( 'express' );
const multer  = require('multer');
const path = require( 'path' );
const upload = multer({ dest: path.join( __dirname, '..', 'admin-uploads' ) });

const { uploadFiles } = require( '../services/admin' );
const { authenticate, isAdmin } = require( '../utils/auth' );
const router = express.Router();

router.post( '/upload/:action', authenticate, isAdmin, upload.single( 'file' ), uploadFiles);

module.exports = router;