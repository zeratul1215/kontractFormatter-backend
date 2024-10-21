const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const styleGroupController = require('../controllers/styleGrouptController');
const router = express.Router();

router.post('/createStyleGroup', verifyToken, styleGroupController.createStyleGroup);
router.post('/deleteStyleGroup', verifyToken, styleGroupController.deleteStyleGroup);
router.get('/getNameOfAllStyleGroups', verifyToken, styleGroupController.getNameOfAllStyleGroups);
router.get('/getStyleGroupDataByID/:styleGroupID', verifyToken, styleGroupController.getStyleGroupDataByID);
router.post('/saveCurrentStylesAsGroup', verifyToken, styleGroupController.saveCurrentStylesAsGroup);

module.exports = router;