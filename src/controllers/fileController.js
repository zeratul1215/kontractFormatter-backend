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
        const newFilePackage = new FilePackage({
            filePackageID: uuidv4(),
            filePackageName: filePackageName,
            userID: userID,
            files: []
        });
        await newFilePackage.save();
        const userData = await UserData.findOne({ userID: userID });
        if (!userData) {
            next(new HttpsError('User data not found', 402));
            return;
        }
        userData.filePackages.push(newFilePackage._id);
        await userData.save();

        res.status(200).json({
            message: 'File package created successfully',
            filePackageID: newFilePackage.filePackageID
        });
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

        const filePackage = await FilePackage.findOneAndDelete({ filePackageID: filePackageID, userID: userID });
        if (!filePackage) {
            next(new HttpsError('File package not found', 404));
            return;
        }

        // 查找对应的 UserData
        const userData = await UserData.findOne({ userID: userID });
        if (!userData) {
            next(new HttpsError('User data not found', 402));
            return;
        }

        // 从 UserData 的 filePackages 中移除该 FilePackage 的 _id
        userData.filePackages = userData.filePackages.filter(id => id.toString() !== filePackage._id.toString());
        await userData.save();

        // 返回成功响应
        res.status(200).json({
            message: 'File package deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
}

exports.getAllFilePackagesInfo = async (req, res, next) => { // 获取所有文件包信息，包括里面的文件名称和每一个文件所有的版本
    try {
        const userID = req.user.userID;

        // 查找对应的 UserData 并填充 filePackages
        const userData = await UserData.findOne({ userID: userID }).populate({
            path: 'filePackages',
            populate: {
                path: 'files',
                populate: {
                    path: 'historyXMLVersions',
                    select: 'versionID versionName'
                }
            }
        });

        if (!userData) {
            next(new HttpsError('User not found', 404));
            return;
        }

        const filePackagesInfo = userData.filePackages.reduce((acc, filePackage) => {
            if(filePackage.filePackageName === 'temp file Package'){
                return acc;
            }
            
            acc[filePackage.filePackageID] = {
                filePackageID: filePackage.filePackageID,
                filePackageName: filePackage.filePackageName,
                files: filePackage.files.reduce((fileAcc, file) => {
                    fileAcc[file.fileID] = {
                        fileID: file.fileID,
                        fileName: file.fileName,
                        versions: file.historyXMLVersions.reduce((versionAcc, version) => {
                            versionAcc[version.versionID] = {
                                versionID: version.versionID,
                                versionName: version.versionName
                            };
                            return versionAcc;
                        }, {})
                    };
                    return fileAcc;
                }, {})
            };
            return acc;
        }, {});

        // 返回成功响应
        res.status(200).json({
            filePackages: filePackagesInfo
        });
    } catch (error) {
        next(error);
    }
}

exports.getFileXML = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const { 
            filePackageID, 
            fileID, 
            versionID 
        } = req.params;

        // 查找对应的 FilePackage
        const filePackage = await FilePackage.findOne({ filePackageID: filePackageID, userID: userID });
        if (!filePackage) {
            next(new HttpsError('File package not found', 404));
            return;
        }

        // 查找指定的 file
        const file = filePackage.files.find(f => f.fileID === fileID);
        if (!file) {
            next(new HttpsError('File not found', 404));
            return;
        }

        // 查找指定的 version
        const version = file.historyXMLVersions.find(v => v.versionID === versionID);
        if (!version) {
            next(new HttpsError('Version not found', 404));
            return;
        }

        version.styleOfThisVersion = version.savedStylesOfThisVersion.map(style => ({
            styleID: style.styleID,
            styleName: style.styleName,
            data: style.data
        }));

        version.sectionsOfThisVersion = version.savedSectionsOfThisVersion.map(section => ({
            sectionID: section.sectionID,
            sectionName: section.sectionName,
            data: section.data
        }));

        await filePackage.save();

        // 返回 versionXML
        res.status(200).json({
            versionXML: version.versionXML
        });
    } catch (error) {
        next(error);
    }
}

exports.saveFileXMLAsExistingVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const { 
            filePackageID, 
            fileID, 
            versionID,
            versionXML
        } = req.body;

        const filePackage = await FilePackage.findOne({ filePackageID: filePackageID, userID: userID });
        if (!filePackage) {
            next(new HttpsError('File package not found', 404));
            return;
        }

        // 查找指定的 file
        const file = filePackage.files.find(f => f.fileID === fileID);
        if (!file) {
            next(new HttpsError('File not found', 404));
            return;
        }

        // 查找指定的 version
        const version = file.historyXMLVersions.find(v => v.versionID === versionID);
        if (!version) {
            next(new HttpsError('Version not found', 404));
            return;
        }

        // 更新 versionXML
        version.versionXML = versionXML;
        version.savedStylesOfThisVersion = version.styleOfThisVersion.map(style => ({
            styleID: style.styleID,
            styleName: style.styleName,
            data: style.data
        }));
        await filePackage.save();

        // 返回成功响应
        res.status(200).json({
            message: 'Version XML updated successfully'
        });
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
            versionName,
            versionXML,
            styleData,
            sectionData
        } = req.body;

        // 查找对应的 FilePackage
        const filePackage = await FilePackage.findOne({ filePackageID: filePackageID, userID: userID });
        if (!filePackage) {
            next(new HttpsError('File package not found', 404));
            return;
        }

        // 查找指定的 file
        const file = filePackage.files.find(f => f.fileID === fileID);
        if (!file) {
            next(new HttpsError('File not found', 404));
            return;
        }

        // 创建新的 version 对象
        const newVersion = {
            versionID: uuidv4(),
            versionName: versionName,
            versionXML: versionXML,
            updatedAt: new Date(),
            styleOfThisVersion: Object.entries(styleData).map(([styleID, styleInfo]) => ({
                styleID: styleID,
                styleName: styleInfo.styleName,
                data: styleInfo.data
            })),
            savedStylesOfThisVersion: Object.entries(styleData).map(([styleID, styleInfo]) => ({
                styleID: styleID,
                styleName: styleInfo.styleName,
                data: styleInfo.data
            })),
            sectionsOfThisVersion: Object.entries(sectionData).map(([sectionID, sectionInfo]) => ({
                sectionID: sectionID,
                sectionName: sectionInfo.sectionName,
                data: sectionInfo.data
            })),
            savedSectionsOfThisVersion: Object.entries(sectionData).map(([sectionID, sectionInfo]) => ({
                sectionID: sectionID,
                sectionName: sectionInfo.sectionName,
                data: sectionInfo.data
            })),
            numberingStyleOfThisVersion: {
                numberingStyleID: uuidv4(),
                numberingStyleName: 'Default Numbering Style'
            },
            sectionInfo: {
                "test": "test"
            } // 如果需要，可以在这里添加章节信息
        };

        // 将新的 version 添加到 historyXMLVersions 数组中
        file.historyXMLVersions.push(newVersion);

        // 更新 currentVersionID
        // file.currentVersionID = newVersion.versionID;

        // 保存更改
        await filePackage.save();

        // 返回成功响应
        res.status(201).json({
            message: 'New version created successfully',
            versionID: newVersion.versionID
        });
    }
    catch (error) {
        next(error);
    }
}

exports.deleteFileVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID
        } = req.body;

        // 查找对应的 FilePackage
        const filePackage = await FilePackage.findOne({ filePackageID: filePackageID, userID: userID });
        if (!filePackage) {
            next(new HttpsError('File package not found', 404));
            return;
        }

        // 查找指定的 file
        const file = filePackage.files.find(f => f.fileID === fileID);
        if (!file) {
            next(new HttpsError('File not found', 404));
            return;
        }

        // 确保文件至少有一个版本
        if (file.historyXMLVersions.length <= 1) {
            next(new HttpsError('Cannot delete the only version of a file', 400));
            return;
        }

        // 查找并删除指定的 version
        const versionIndex = file.historyXMLVersions.findIndex(v => v.versionID === versionID);
        if (versionIndex === -1) {
            next(new HttpsError('Version not found', 404));
            return;
        }

        // 删除版本
        file.historyXMLVersions.splice(versionIndex, 1);

        // 如果删除的是当前版本，更新 currentVersionID
        if (file.currentVersionID === versionID) {
            file.currentVersionID = file.historyXMLVersions[file.historyXMLVersions.length - 1].versionID;
        }

        // 保存更改
        await filePackage.save();

        // 返回成功响应
        res.status(200).json({
            message: 'File version deleted successfully'
        });
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
            versionName,
            versionXML,
            styleData,
            sectionData
        } = req.body;

        // 查找对应的 FilePackage
        const filePackage = await FilePackage.findOne({ filePackageID: filePackageID, userID: userID });
        if (!filePackage) {
            next(new HttpsError('File package not found', 404));
            return;
        }

        // 创建新的 file 对象
        const newFile = {
            fileID: uuidv4(),
            fileName: fileName,
            // currentVersionID: uuidv4(), // 初始版本的 ID
            historyXMLVersions: [{
                versionID: uuidv4(),
                versionName: versionName,
                versionXML: versionXML,
                updatedAt: new Date(),
                styleOfThisVersion: Object.entries(styleData).map(([styleID, styleInfo]) => ({
                    styleID: styleID,
                    styleName: styleInfo.styleName,
                    data: styleInfo.data
                })),
                savedStylesOfThisVersion: Object.entries(styleData).map(([styleID, styleInfo]) => ({
                    styleID: styleID,
                    styleName: styleInfo.styleName,
                    data: styleInfo.data
                })),
                sectionsOfThisVersion: Object.entries(sectionData).map(([sectionID, sectionInfo]) => ({
                    sectionID: sectionID,
                    sectionName: sectionInfo.sectionName,
                    data: sectionInfo.data
                })),
                savedSectionsOfThisVersion: Object.entries(sectionData).map(([sectionID, sectionInfo]) => ({
                    sectionID: sectionID,
                    sectionName: sectionInfo.sectionName,
                    data: sectionInfo.data
                })),
                numberingStyleOfThisVersion: {
                    numberingStyleID: uuidv4(),
                    numberingStyleName: 'Default Numbering Style',
                },
                sectionInfo: {
                    "test": "test"
                } // 如果需要，可以在这里添加章节信息
            }]
        };

        // 将新的 file 添加到 FilePackage 的 files 数组中
        filePackage.files.push(newFile);

        // 保存更改
        await filePackage.save();

        // 返回成功响应
        res.status(201).json({
            message: 'New file added successfully',
            fileID: newFile.fileID,
            versionID: newFile.historyXMLVersions[0].versionID
        });
    }
    catch (error) {
        next(error);
    }
}

exports.deleteFile = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID
        } = req.body;

        // 查找对应的 FilePackage
        const filePackage = await FilePackage.findOne({ filePackageID: filePackageID, userID: userID });
        if (!filePackage) {
            next(new HttpsError('File package not found', 404));
            return;
        }

        // 查找并删除指定的 file
        const fileIndex = filePackage.files.findIndex(f => f.fileID === fileID);
        if (fileIndex === -1) {
            next(new HttpsError('File not found', 404));
            return;
        }

        // 删除文件
        filePackage.files.splice(fileIndex, 1);

        // 保存更改
        await filePackage.save();

        // 返回成功响应
        res.status(200).json({
            message: 'File deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
}
