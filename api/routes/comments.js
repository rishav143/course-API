const express = require('express');
const router = express();

router.post('/', (req, res, next) => {
    res.status(201).json({
        message : 'added comment sucessfully'
    });
});