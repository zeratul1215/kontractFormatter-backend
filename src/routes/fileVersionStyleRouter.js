const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const fileVersionStyleController = require('../controllers/fileVersionStyleController');
const router = express.Router();

router.get('/getStylesInCurrentVersion/:filePackageID/:fileID/:versionID', verifyToken, fileVersionStyleController.getStylesIncurrentVersion);
router.post('/createStyleInCurrentVersion', verifyToken, fileVersionStyleController.createStyleInCurrentVersion);
router.post('/deleteStyleInCurrentVersion', verifyToken, fileVersionStyleController.deleteStyleInCurrentVersion);
router.post('/eraseAllStylesInCurrentVersion', verifyToken, fileVersionStyleController.eraseAllStylesInCurrentVersion);
router.post('/copyStyleFromStyleGroupInCurrentVersion', verifyToken, fileVersionStyleController.copyStyleFromStyleGroupInCurrentVersion);
router.post('/editStyleInCurrentVersion', verifyToken, fileVersionStyleController.editStyleInCurrentVersion);
router.post('/editStyleByIdInCurrentVersion', verifyToken, fileVersionStyleController.editStyleByIdInCurrentVersion);


module.exports = router;

