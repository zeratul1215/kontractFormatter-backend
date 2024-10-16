require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const path = require('path');

const indexRouter = require('./routes/index');
const errorHandler = require('./utils/errorHandlers');
const connectDB = require('./config/mongoConnect');
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.use(errorHandler);

connectDB();

const options = {
    key: fs.readFileSync(path.join(__dirname,"..", "ssl", 'localhost-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, "..", "ssl", 'localhost.pem'))
};

const PORT = process.env.PORT || 3001;

const server = https.createServer(options, app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

module.exports = app;
