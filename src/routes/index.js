const express = require('express');
const router = express.Router();

const userRouter = require('./userRouter');
const styleRouter = require('./styleRouter');
const fileRouter = require('./fileRouter');

router.use('/user', userRouter);
router.use('/style', styleRouter);
router.use('/file', fileRouter);

module.exports = router;

