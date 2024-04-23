const express = require('express')
const router = express.Router();

const userController = require('../controllers/userControllers');
const verifyToken = require('../middleware/verifyToken')
const verifyAdmin = require('../middleware/verifyAdmin')

router.get('/',verifyToken, verifyAdmin,  userController.getAllUsers);
router.post('/', userController.createUser);
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser);
router.get('/admin/:email', verifyToken,verifyAdmin , userController.getAdmin);
router.patch('/admin/:id', verifyToken, verifyAdmin, userController.makeAdmin);
// New route to update user's name
router.patch("/:id/name", verifyToken, userController.updateUserName);

module.exports = router;