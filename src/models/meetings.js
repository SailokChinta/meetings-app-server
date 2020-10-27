const mongoose = require( 'mongoose' );


const attendeesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, { _id: false });

const meetingsSchema = new mongoose.Schema({
    name: String,
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        hours: {
            type: Number,
            required: true,
            min: 0,
            max: 23
        },
        minutes: {
            type: Number,
            required: true,
            min: 0,
            max: 59
        },
        // required: true
    },
    endTime: {
        hours: {
            type: Number,
            required: true,
            min: 0,
            max: 23
        },
        minutes: {
            type: Number,
            required: true,
            min: 0,
            max: 59
        },
        // required: true
    },
    attendees: {
        type: [ attendeesSchema ],
        required: true
    }
}, { versionKey: false });

mongoose.model( 'meeting', meetingsSchema );