const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  backlogs: {
    type:Number,
  },
  todo: {
    type:Number,
  },
  progress: {
    type:Number,
  },
  done: {
    type:Number,
  },
});

module.exports = mongoose.model("Analytics", analyticsSchema);

