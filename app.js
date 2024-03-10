const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const mongoose = require('mongoose');

const courseRoutes = require('./api/routes/courses');
const leadRoutes = require('./api/routes/leads');
const commentRoutes = require('./api/routes/comments');

mongoose.connect(
    "mongodb+srv://rc8344353:" +
    process.env.MONGO_ATLAS_PW +
    "@course-api.wit0kps.mongodb.net/?retryWrites=true&w=majority&appName=course-API"
)

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// to prevent CORS errors
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/courses', courseRoutes);
app.use('/leads', leadRoutes);
app.use('/comments', commentRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status(404);
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;