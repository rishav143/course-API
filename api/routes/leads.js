const express = require('express');
const router = express();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message : 'lead found sucessfully',
        info : req.params.info
    });
});

router.patch('/:status', (req, res, next) => {
    const update = {
        status: req.body.status
    }
    res.status(200).json({
        status: `lead status is ${req.params.status}`,
        updateStatus: update
    });
});

module.exports = router;