var SentenceController = require('../controllers/sentences');

var express = require('express');
var router = express.Router();

//define sentence routes
router.get('/', SentenceController.search);
router.get('/:id', SentenceController.getById);

// router.post('/', SentenceController.create);
//
// router.put('/:id', SentenceController.update);
//
// router.delete('/:id', SentenceController.remove);

//export routes
module.exports = router;
