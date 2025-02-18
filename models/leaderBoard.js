const mongoose = require("mongoose");

const leaderBoardSchema = mongoose.Schema({
    section: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
        default: 'bg-slate-900',
    },
    border: {
        type: String,
        required: true,
    },
});

const LeaderBoard = mongoose.model("LeaderBoard", leaderBoardSchema);
module.exports = LeaderBoard;
