const express = require('express');
const app = express();

const courseRoutes = require('./api/routes/courses');
const leadRoutes = require('./api/routes/leads');
const commentRoutes = require('./api/routes/comments');

app.use('/courses', courseRoutes);
app.use('/leads', leadRoutes);
app.use('/comments', commentRoutes);

module.exports = app;