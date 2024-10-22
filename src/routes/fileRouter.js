const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const fileController = require('../controllers/fileController');
const router = express.Router();

router.post('/createFilePackage', verifyToken, fileController.createFilePackage);
router.post('/deleteFilePackage', verifyToken, fileController.deleteFilePackage);
router.get('/getAllFilePackagesInfo', verifyToken, fileController.getAllFilePackagesInfo);
router.get('/getFileXML/:filePackageID/:fileID/:versionID', verifyToken, fileController.getFileXML);
router.post('/saveFileXMLAsExistingVersion', verifyToken, fileController.saveFileXMLAsExistingVersion);
router.post('/saveFileXMLAsNewVersion', verifyToken, fileController.saveFileXMLAsNewVersion);
router.post('/addNewFileToFilePackage', verifyToken, fileController.addNewFileToFilePackage);

module.exports = router;