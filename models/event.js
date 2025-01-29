const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    eventname: {
        required: true,
        type: String,
    },
    venue: {
        required: true,
        type: String,
    },
    date: {
        required: true,
        type: String,
    },
    time: {
        required: true,
        type: String,
    },
    registrationDeadline: {
        type: String,
        required: true,
    },
    eventDetails: {
        type: String,
        required: true,
    },
    imgPath: {
        type: String,
        required: true,
    },
    imgPathDeleteHash: {
        type: String,
        required: true,
    },
    absImgPath: {
        type: String,
        required: true,
    },
    absImgPathDeleteHash: {
        type: String,
        required: true,
    },
    googleFormLink: {
        type: String,
        required: true,
    },
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
