const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const fileVersionStyleController = require('../controllers/fileVersionStyleController');
const router = express.Router();


router.post('/createStyleInCurrentVersion', verifyToken, fileVersionStyleController.createStyleInCurrentVersion);
router.post('/deleteStyleInCurrentVersion', verifyToken, fileVersionStyleController.deleteStyleInCurrentVersion);
router.post('/editStyleInCurrentVersion', verifyToken, fileVersionStyleController.editStyleInCurrentVersion);
router.post('/editStyleByIdInCurrentVersion', verifyToken, fileVersionStyleController.editStyleByIdInCurrentVersion);

module.exports = router;

