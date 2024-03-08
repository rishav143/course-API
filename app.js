const express = require('express');
const app = express();

const courseRoutes = require('./api/routes/courses');
const leadRoutes = require('./api/routes/leads');
const commentRoutes = require('./api/routes/comments');

//Routes which should handle requests
app.use('/courses', courseRoutes);
app.use('/leads', leadRoutes);
app.use('/comments', commentRoutes);

app.use((req, res, next) => {
    const error = new error('Not found');
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