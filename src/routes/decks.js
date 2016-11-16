var DeckController = require('../controllers/decks');

var express = require('express');
var router = express.Router();

//define deck routes
router.get('/', DeckController.getAll);
router.get('/:id', DeckController.getById);
router.get('/:id/sentences', DeckController.getAllSentencesInDeck);
router.get('/:id/comments', DeckController.getAllCommentsForDeck);

router.post('/', DeckController.create);

router.put('/:id', DeckController.update);

router.delete('/:id', DeckController.remove);


//export routes
module.exports = router;
