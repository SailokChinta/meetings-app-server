const mongoose = require( 'mongoose' );

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: '^[a-zA-Z0-9_.]+@[a-zA-Z0-9.-]+$'
    },
    password: {
        type: String,
        required: true
    }
});

mongoose.model( 'user', userSchema );