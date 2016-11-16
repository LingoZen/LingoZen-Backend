var SentenceController = require('../controllers/sentences');

var express = require('express');
var router = express.Router();

var controller = new SentenceController();

//define sentence routes
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/comments', controller.getAllCommentsForSentence);

router.post('/', controller.create);

router.put('/:id', controller.update);

router.delete('/:id', controller.remove);


//export routes
module.exports = router;
