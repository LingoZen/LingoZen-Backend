let SentenceController = require('../controllers/sentences');

let express = require('express');
let router = express.Router();

//define sentence routes
router.get('/', SentenceController.search);
router.get('/:id', SentenceController.getById);

router.post('/:id/translations', SentenceController.addTranslation);
router.post('/', SentenceController.create);

// router.put('/:id', SentenceController.update);

// router.delete('/:id', SentenceController.remove);

//export routes
module.exports = router;
