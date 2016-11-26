let CommentController = require('../controllers/comments');

let express = require('express');
let router = express.Router();

//define comment routes
router.get('/', CommentController.getAll);
router.get('/:id', CommentController.getById);

router.post('/sentence/:id', CommentController.create);

router.put('/:id', CommentController.update);

router.delete('/:id', CommentController.remove);

//export routes
module.exports = router;
