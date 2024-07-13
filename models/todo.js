const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type:String,
    required:true
  },
  priority: {
    type:String,
    required:true
  },

  list:{
    type: [String]
  },
  date: {
    type: Date,
    default: Date.now // Set default value to the current date and time
  },
  dueDate:{
    type:String
  },
  checkedTasks: {
    type: [Boolean] // Array of booleans to represent checked status of tasks
  }
});

const Task = mongoose.model('Todos', todoSchema);

module.exports = Task;

