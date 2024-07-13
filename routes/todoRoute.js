const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// Route to handle saving data
router.post('/saveData', async (req, res) => {
  try {
    const { title, priority, list, dueDate, checkedTasks } = req.body;
    const currentDate = new Date();
    const task = new Todo({
      title,
      priority,
      list,
      date: currentDate,
      dueDate,
      checkedTasks
    });
    console.log("llllll",task)
    await task.save();
    res.status(200).send('Data saved successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});


// Route to fetch saved data
router.get('/getData', async (req, res) => {
    try {
      const data = await Todo.find();
      console.log("llllll",data)

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });


// Delete a TO-DO by ID
router.delete('/delete/:id', async (req, res) => {
  const objectId = req.params.id;
  console.log(objectId)
  try {
      // Use the Quiz model to find and remove the quiz by ID
      const deletedTodo = await Todo.findByIdAndDelete(objectId);

      if (!deletedTodo) {
          return res.status(404).json({ success: false, error: 'Invalid quiz ID. Unable to delete requested quiz.' });
      }

      res.status(200).json({ success: true, message: 'Quiz deleted successfully', deletedTodo });
  } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error. Failed to delete quiz.' });
  }
});





// Route to fetch a todo item by ID
router.get('/getEditData/:id', async (req, res) => {
  const objectId = req.params.id;
  try {
    // Use the Todo model to find the todo item by ID
    const todoItem = await Todo.findById(objectId);
    
    if (!todoItem) {
      // If no todo item is found with the provided ID, return a 404 error
      return res.status(404).json({ success: false, error: 'Todo item not found' });
    }
    
    // If the todo item is found, return it in the response
    // res.status(200).json({ success: true, todoItem });
    res.status(200).json(todoItem);

  } catch (error) {
    // If an error occurs, return a 500 error
    console.error('Error fetching todo item by ID:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error. Failed to fetch todo item by ID.' });
  }
});



// Route to handle updating data
router.put('/update/:id', async (req, res) => {
  const todoId = req.params.id;
  try {
    const { title, priority, list, dueDate, checkedTasks } = req.body;
    const updatedData = {
      title,
      priority,
      list,
      dueDate,
      checkedTasks
    };
    // Find the Todo item by its ID and update it with the new data
    const updatedTodo = await Todo.findByIdAndUpdate(todoId, updatedData, { new: true });

    if (!updatedTodo) {
      return res.status(404).json({ success: false, error: 'Todo not found. Unable to update.' });
    }

    res.status(200).json({ success: true, message: 'Todo updated successfully', updatedTodo });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error. Failed to update todo.' });
  }
});







////////////////////// FILTER

// Route to filter todos based on date range
router.get('/filterData/:timeRange', async (req, res) => {
  try {
    const {timeRange}  = req.params;
    console.log(timeRange)
    let startDate, endDate;

    // Determine the start and end date based on the time range
    switch (timeRange) {
      case 'Today':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // Set to the beginning of the day
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999); // Set to the end of the day
        break;
      case 'This week':
        // Calculate start and end of the week
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        startDate = firstDayOfWeek;
        endDate = lastDayOfWeek;
        break;
      case 'This Month':
        // Calculate start and end of the month
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        startDate = firstDayOfMonth;
        endDate = lastDayOfMonth;
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid time range' });
    }

    // Query the todos collection for todos within the specified date range
    const todos = await Todo.find({
      date: { $gte: startDate, $lte: endDate }
    });

    // res.json({ success: true, data: todos });
    res.json(todos );

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


module.exports = router;
