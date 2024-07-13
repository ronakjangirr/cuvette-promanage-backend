const express = require('express');
const router = express.Router();
const Analytics = require('../models/analytics');

// Route to handle updating analytics data
router.post('/saveAnalytics', async (req, res) => {
    try {
      const { backlogLength, todoLength, progressLength, doneLength } = req.body;

      // Create or update analytics data in the database
      await Analytics.findOneAndUpdate({}, { backlogs: backlogLength, todo: todoLength, progress: progressLength, done: doneLength }, { upsert: true });

      // res.status(200).json({ message: 'Analytics data updated successfully' });
      res.status(200).json({
        message: 'Analytics data updated successfully',
        lengths: {
            backlogs: backlogLength,
            todo: todoLength,
            progress: progressLength,
            done: doneLength
        }
    });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});



// Route to handle fetching analytics data
router.get('/getAnalytics', async (req, res) => {
  try {
    // Retrieve analytics data from the database
    const analyticsData = await Analytics.findOne({});

    // Send response with analytics data
    res.status(200).json(analyticsData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
