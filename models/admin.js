const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    adminName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    rights: {
        type: String,
    },
    Name: {
        type: String,
        required: true,
    },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
