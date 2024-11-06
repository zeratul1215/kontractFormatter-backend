const AuthUser = require('../models/AuthUser');
const FilePackage = require('../models/FilePackage');
const UserData = require('../models/UserData');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

exports.signUp = async (req, res, next) => {
    try {
        console.log("signUp");
        const { userName, password, email } = req.body;

        const existingUser = await AuthUser.findOne({ email : email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new AuthUser({
            userID: uuidv4(),
            userName: userName,
            password: password,
            email: email
        });

        await newUser.save();





        // 创建临时文件包
        const tempFilePackage = new FilePackage({
            filePackageID: process.env.TEMP_FILE_PACKAGE_ID,
            filePackageName: 'temp file Package',
            userID: newUser.userID,
            files: [{
                fileID: process.env.TEMP_FILE_ID,
                fileName: 'temp file',
                // currentVersionID: process.env.TEMP_VERSION_ID,
                historyXMLVersions: [{
                    versionID: process.env.TEMP_VERSION_ID,
                    versionName: 'temp version',
                    versionXML: '<xml>temp Content</xml>',
                    styleOfThisVersion: [],
                    savedStylesOfThisVersion: [],
                    sectionsOfThisVersion: [],
                    savedSectionsOfThisVersion: [],
                    numberingStyleOfThisVersion: {
                        numberingStyleID: 'defaultID', // 提供默认值
                        numberingStyleName: 'defaultName' // 提供默认值
                    }
                }]
            }]
        });

        await tempFilePackage.save();

        const newUserData = new UserData({
            userID: newUser.userID,
            filePackages: [tempFilePackage._id],
            styleGroups: [],
            numberingStyles: []
        });

        await newUserData.save();

        const token = jwt.sign({ userID: newUser.userID }, process.env.JWT_SECRET, { expiresIn: '10000h' });

        res.status(201).json({ message: 'User created successfully', JWT: token });
    }
    catch (error) {
        next(error);
    }
};

exports.signIn = async (req, res, next) => {
    try {
        console.log("signIn");
        const { email, password } = req.body;

        const user = await AuthUser.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({ message: 'Invalid password' });
        }


        const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, { expiresIn: '10000h' });

        res.status(200).json({ message: 'User signed in successfully', JWT: token });
    }
    catch (error) {
        next(error);
    }
};
