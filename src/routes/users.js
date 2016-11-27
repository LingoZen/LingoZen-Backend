let UserController = require('../controllers/users');

let express = require('express');
let router = express.Router();


//define user routes
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);

router.post('/login', UserController.login);

router.post('/', UserController.create);

router.put('/me', UserController.updateJwtUser);
router.put('/:id', UserController.update);

router.delete('/:id', UserController.remove);


//export routes
module.exports = router;
