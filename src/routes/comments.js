var CommentController = require('../controllers/comments');

var express = require('express');
var router = express.Router();

//define comment routes
router.get('/', CommentController.getAll);
router.get('/:id', CommentController.getById);

router.post('/', CommentController.create);

router.put('/:id', CommentController.update);

router.delete('/:id', CommentController.remove);

//export routes
module.exports = router;
