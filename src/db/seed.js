const { execSync } = require( 'child_process' );
const path = require( 'path' );

function seed() {
    try{
        execSync( `mongoimport --db meetings-app --collection users --drop --file ${ path.join( __dirname, '..', 'data','users.json' ) } --jsonArray` );
        execSync( `mongoimport --db meetings-app --collection meetings --drop --file ${ path.join( __dirname, '..', 'data','meetings.json' ) } --jsonArray` );
        execSync( `mongoimport --db meetings-app --collection teams --drop --file ${ path.join( __dirname, '..', 'data','teams.json' ) } --jsonArray` );
    } catch ( err ) {
        console.error( `Documents could not be imported. Failed with error: ${error.message}` );
    }
}

module.exports = {
    seed
}

