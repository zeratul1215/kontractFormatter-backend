const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const fileVersionStyleController = require('../controllers/fileVersionStyleController');
const router = express.Router();

router.get('/getStylesAndSectionsIncurrentVersion/:filePackageID/:fileID/:versionID', verifyToken, fileVersionStyleController.getStylesAndSectionsIncurrentVersion);
router.post('/createStyleInCurrentVersion', verifyToken, fileVersionStyleController.createStyleInCurrentVersion);
router.post('/deleteStyleInCurrentVersion', verifyToken, fileVersionStyleController.deleteStyleInCurrentVersion);
router.post('/createSectionInCurrentVersion', verifyToken, fileVersionStyleController.createSectionInCurrentVersion);
router.post('/deleteSectionInCurrentVersion', verifyToken, fileVersionStyleController.deleteSectionInCurrentVersion);
router.post('/eraseAllStylesInCurrentVersion', verifyToken, fileVersionStyleController.eraseAllStylesInCurrentVersion);
router.post('/eraseAllSectionsInCurrentVersion', verifyToken, fileVersionStyleController.eraseAllSectionsInCurrentVersion);
router.post('/eraseAllStylesAndSectionsInCurrentVersion', verifyToken, fileVersionStyleController.eraseAllStylesAndSectionsInCurrentVersion);
router.post('/copyStyleFromStyleGroupInCurrentVersion', verifyToken, fileVersionStyleController.copyStyleFromStyleGroupInCurrentVersion);
router.post('/copySectionFromStyleGroupInCurrentVersion', verifyToken, fileVersionStyleController.copySectionFromStyleGroupInCurrentVersion);
router.post('/copyStyleAndSectionFromStyleGroupInCurrentVersion', verifyToken, fileVersionStyleController.copyStyleAndSectionFromStyleGroupInCurrentVersion);
router.post('/editStyleInCurrentVersion', verifyToken, fileVersionStyleController.editStyleInCurrentVersion);
router.post('/editStyleByIdInCurrentVersion', verifyToken, fileVersionStyleController.editStyleByIdInCurrentVersion);
router.post('/editSectionInCurrentVersion', verifyToken, fileVersionStyleController.editSectionInCurrentVersion);
router.post('/restoreStyleDataToSaved', verifyToken, fileVersionStyleController.restoreStyleDataToSaved);
router.post('/restoreSectionDataToSaved', verifyToken, fileVersionStyleController.restoreSectionDataToSaved);
router.post('/eraseAllDataInTempFilePackage', verifyToken, fileVersionStyleController.eraseAllDataInTempFilePackage);

module.exports = router;

