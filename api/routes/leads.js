const express = require('express');
const router = express();

const Lead = require('../models/lead')

router.get('/:leadId', (req, res, next) => {
    const id = req.params.leadId;

    Lead.findById(id)
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Lead found successfully',
                lead: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:leadId', (req, res, next) => {
    const id = req.params.leadId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Lead.updateMany({ _id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Lead updated',
                request: {
                    type: 'GET',
                    url: 'https://localhost:3000/leads/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;