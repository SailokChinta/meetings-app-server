const express = require( 'express' );
const multer  = require('multer');
const path = require( 'path' );
const upload = multer({ 
    dest: path.join( __dirname, '..', 'admin-uploads' ),
    fileFilter: (req, file, next) => {
        if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ) {
            next(null, true);
        } else {
            const error = new Error( 'Only .xlsx format allowed' );
            error.status = 400;
            next( error );
        }
      } 
});

const { uploadFiles } = require( '../services/admin' );
const { authenticate, isAdmin } = require( '../utils/auth' );
const { 
    getAllUsers, 
    getAllMeetings, 
    getAllTeams 
} = require('../controller/admin' );

const router = express.Router();

router.get( '/users', authenticate, isAdmin, getAllUsers );
router.get( '/meetings', authenticate, isAdmin, getAllMeetings );
router.get( '/teams', authenticate, isAdmin, getAllTeams );
router.post( '/upload/:action', authenticate, isAdmin, upload.single( 'file' ), uploadFiles);

module.exports = router;