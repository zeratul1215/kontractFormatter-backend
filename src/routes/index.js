const express = require('express');
const router = express.Router();

const userRouter = require('./userRouter');
const styleGroupRouter = require('./styleGroupRouter');
const fileRouter = require('./fileRouter');
const fileVersionStyleRouter = require('./fileVersionStyleRouter');

router.use('/user', userRouter);
router.use('/styleGroup', styleGroupRouter);
router.use('/fileVersionStyle', fileVersionStyleRouter);
router.use('/file', fileRouter);

module.exports = router;

