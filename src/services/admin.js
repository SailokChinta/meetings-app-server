const { connection } = require('mongoose');
const path = require( 'path' );
const fs = require( 'fs' );

const EXCEL = '.xlsx'; 

function uploadFiles ( req, res, next ) {
    const filename = req.file.filename;
    const path = req.file.path.slice( 0, -filename.length );
    const action = req.params.action
    const newPath = `${path}${action}`;
    const newName = `${new Date().toISOString()}-${action}${EXCEL}`;
    
    try {
        fs.rename( `${path}/${filename}`, `${newPath}/${newName}`, ( err ) => {
            if( err ) {
                throw err;
            }
        });

        fs.appendFileSync( `${newPath}/logfile.txt`, `${newName} added on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} by ${res.locals.claims.email}\n`, err => {
            if( err ) {
                throw err;
            }
        });

    } catch ( err ) {
        next( error );
    }
}


module.exports = {
    uploadFiles
}
