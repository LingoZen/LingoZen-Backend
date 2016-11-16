var UserController = require('../controllers/users');

var express = require('express');
var router = express.Router();


//define user routes
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);

router.post('/login', UserController.login);

router.post('/', UserController.create);

router.put('/:id', UserController.update);

router.delete('/:id', UserController.remove);


//export routes
module.exports = router;
