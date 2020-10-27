require( './db/init' )
const express = require( 'express' );

const usersRouter = require( './routes/users' );
const meetingsRouter = require( './routes/meetings' );

const { genericApiErrorHandler } = require('./middleware/error');

const port = process.env.PORT || 8080;
const app = express();

app.use( express.json() );
app.use( express.urlencoded() );

app.use( '/api/users', usersRouter );
app.use( '/api/meetings', meetingsRouter );


app.use( genericApiErrorHandler );

app.listen( port, err => {
    if( err ) {
        console.log( err.message );
        return;
    }
    console.log( `Server started at http://localhost:${port}` );
});