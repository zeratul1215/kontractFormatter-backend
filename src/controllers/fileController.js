const UserData = require("../models/UserData");
const FilePackage = require("../models/FilePackage");
const HttpsError = require("../utils/HttpsError");
const { v4: uuidv4 } = require('uuid');

exports.createFilePackage = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageName
        } = req.body;
    }
    catch (error) {
        next(error);
    }
}

exports.deleteFilePackage = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID
        } = req.body;
    }
    catch (error) {
        next(error);
    }
}

exports.getAllFilePackagesInfo = async (req, res, next) => { // 获取所有文件包信息，包括里面的文件名称和每一个文件所有的版本
    try {
        const userID = req.user.userID;
    }
    catch (error) {
        next(error);
    }
}

exports.getFileXML = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const { filePackageID, fileID, versionID } = req.params;
    }
    catch (error) {
        next(error);
    }
}

exports.saveFileXMLAsExistingVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const { 
            filePackageID, 
            fileID, 
            versionID 
        } = req.body;
    }
    catch (error) {
        next(error);
    }
}

exports.saveFileXMLAsNewVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const { 
            filePackageID, 
            fileID,
            versionName
        } = req.body;
    }
    catch (error) {
        next(error);
    }
}

exports.addNewFileToFilePackage = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const { 
            filePackageID, 
            fileName,
            versionName
        } = req.body;
        
    }
    catch (error) {
        next(error);
    }
}
