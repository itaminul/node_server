const express = require('express')
const router = express.Router()
const jobController = require('../controller/jobsController')

router.get('/getAll', jobController.getAll)
router.post('/create', jobController.create)
router.patch('/update', jobController.update)
router.delete('/delete', jobController.delete)

module.exports = router;