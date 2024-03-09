const express = require('express');
const router = express();

router.post('/', (req, res, next) => {
    const comment = {
        message: req.body.message
    }
    res.status(201).json({
        message : 'added comment sucessfully',
        comment: comment
    });
});

module.exports = router;