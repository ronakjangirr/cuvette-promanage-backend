const express = require('express');
const cors = require('cors');
require('./database/proConfig');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
require('dotenv').config();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


// const dashboardRoute = require('./routes/dashboard');
// app.use('/api/', dashboardRoute);


const analyticsRouter = require('./routes/analyticsRoute')
app.use('/api/analytics', analyticsRouter);

const authRouter = require('./routes/auth')
app.use('/api/auth', authRouter);

const todoRouter = require('./routes/todoRoute')
app.use('/api/todo', todoRouter)


const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
    console.log(`Pro-manage Serve is running successfully on ${PORT}`);
});
