const express = require('express');
const router = express();

router.get('/:info', (req, res, next) => {
    res.status(200).json({
        message : 'lead found sucessfully',
        info : req.params.info
    });
});

router.patch('/:status', (req, res, next) => {
    res.status(200).json({
        status: `lead status is ${req.params.status}`
    });
});

module.exports = router;