require( './db/init' )
const express = require( 'express' );

const cors = require( 'cors' );

const usersRouter = require( './routes/users' );
const meetingsRouter = require( './routes/meetings' );
const teamsRouter = require( './routes/teams' );
const authRouter = require( './routes/auth' );
const adminRouter = require( './routes/admin' );
const { dateLogger } = require( './middleware/dateLogger' );

const { genericApiErrorHandler } = require('./middleware/error');

const port = process.env.PORT || 8080;
const app = express();


app.use( cors() );
app.use( dateLogger );
app.use( express.json() );
app.use( express.urlencoded() );


app.use( '/api/auth', authRouter );
app.use( '/api/users', usersRouter );
app.use( '/api/meetings', meetingsRouter );
app.use( '/api/teams', teamsRouter );
app.use( '/api/admin', adminRouter );


app.use( genericApiErrorHandler );

app.listen( port, err => {
    if( err ) {
        console.log( err.message );
        return;
    }
    console.log( `Server started at http://localhost:${port}` );
});