const mongoose = require( 'mongoose' );
const { seed } = require('./seed');

require( '../models/users' );
require( '../models/meetings' );

mongoose.set( 'useFindAndModify', false );
mongoose.set( 'returnOriginal', false );

const uri = 'mongodb://localhost:27017/meetings-app'

mongoose.connect( uri, { useNewUrlParser: true } );

mongoose.connection.on( 'open', () => {
    console.log( 'Successfully connected to db' );
    // uncomment to import data
    seed();
});

mongoose.connection.on( 'error', err => {
    console.log( err.message );
    process.exit();
});