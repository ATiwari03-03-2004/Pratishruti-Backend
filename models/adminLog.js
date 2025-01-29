const mongoose = require("mongoose");

const adminLogSchema = mongoose.Schema({
  adminName: {
    required: true,
    type: String,
  },
  operation: {
    required: true,
    type: String,
  },
  eventname: {
    required: true,
    type: String,
  },
  when: {
    type: String,
    required: true,
  }
});

const Log = mongoose.model("Log", adminLogSchema);
module.exports = Log;
