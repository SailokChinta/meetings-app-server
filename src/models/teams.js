const mongoose = require( 'mongoose' );

const memberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, { _id: false });

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    members: {
        type: [ memberSchema ],
        required: true
    }
});

mongoose.model( 'team', teamSchema );