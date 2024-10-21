const UserData = require("../models/UserData");
const FilePackage = require("../models/FilePackage");
const HttpsError = require("../utils/HttpsError");
const { v4: uuidv4 } = require('uuid');

exports.getStylesIncurrentVersion = async(req, res, next) => {
    try {
        const { filePackageID, fileID, versionID } = req.params;
        const userID = req.user.userID;

        const filePackage = await FilePackage.findOne({ filePackageID: filePackageID, userID: userID });
        if (!filePackage) {
            next(new HttpsError('File package not found', 402));
            return;
        }

        const file = filePackage.files.find(f => f.fileID === fileID);
        if (!file) {
            next(new HttpsError('File not found', 402));
            return;
        }

        const version = file.historyXMLVersions.find(v => v.versionID === versionID);
        if (!version) {
            next(new HttpsError('Version not found', 402));
            return;
        }

        const stylesData = {};
        version.styleOfThisVersion.forEach(style => {
            stylesData[style.styleID] = {
                styleName: style.styleName,
                data: style.data
            };
        });

        res.status(200).json({
            data: stylesData
        });
    } catch (error) {
        next(error);
    }
}


exports.createStyleInCurrentVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID,
            styleName
        } = req.body;

        const filePackage = await FilePackage.findOne({filePackageID: filePackageID, userID: userID});
        if (!filePackage) {
            next(new HttpsError('File package not found', 402));
            return;
        }

        const file = filePackage.files.find(f => f.fileID === fileID);
        if (!file) {
            next(new HttpsError('File not found', 402));
            return;
        }

        const version = file.historyXMLVersions.find(v => v.versionID === versionID);
        if (!version) {
            next(new HttpsError('Version not found', 402));
            return;
        }

        const style = version.styleOfThisVersion.find(s => s.styleName === styleName);
        if (style) {
            next(new HttpsError('Style already exists', 402));
            return;
        }

        const newStyle = {
            styleID: uuidv4(),
            styleName: styleName,
            data: {
                fontChineseName: "SimSun",
                fontEnglishName: "Arial",
                fontSize: 10,
                fontBold: false,
                fontItalic: false,
                fontUnderLine: "None",
                fontColor: "#000000",
                formatLineSpacing: 30,
                formatFirstLineIndent: 0,
                formatAlignment: "left",
                formatLeftIndent: 0,
                formatRightIndent: 0,
                formatSpaceBefore: 0,
                formatSpaceAfter: 0,
            }
        }

        version.styleOfThisVersion.push(newStyle);
        await filePackage.save();

        res.status(200).json({
            data: {
                message: "success",
                styleID: newStyle.styleID
            }
        });
    }
    catch (error) {
        next(error);
    }
}

exports.deleteStyleInCurrentVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID,
            styleID
        } = req.body;

        console.log("filePackageID: ", filePackageID);
        console.log("fileID: ", fileID);
        console.log("versionID: ", versionID);
        console.log("styleID: ", styleID);

        const filePackage = await FilePackage.findOne({filePackageID: filePackageID, userID: userID});
        if (!filePackage) {
            next(new HttpsError('File package not found', 402));
            return;
        }

        const file = filePackage.files.find(f => f.fileID === fileID);
        if (!file) {
            next(new HttpsError('File not found', 402));
            return;
        }

        const version = file.historyXMLVersions.find(v => v.versionID === versionID);
        if (!version) {
            next(new HttpsError('Version not found', 402));
            return;
        }

        const styleIndex = version.styleOfThisVersion.findIndex(s => s.styleID === styleID);
        if (styleIndex === -1) {
            next(new HttpsError('Style not found', 402));
            return;
        }

        version.styleOfThisVersion.splice(styleIndex, 1);
        await filePackage.save();

        res.status(200).json({
            data: {
                message: "Style deleted successfully"
            }
        });
    }
    catch (error) {
        next(error);
    }
}   

exports.eraseAllStylesInCurrentVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID
        } = req.body;
        const filePackage = await FilePackage.findOne({ filePackageID: filePackageID, userID: userID });
        if (!filePackage) {
            next(new HttpsError('File package not found', 402));
            return;
        }

        const file = filePackage.files.find(f => f.fileID === fileID);
        if (!file) {
            next(new HttpsError('File not found', 402));
            return;
        }

        const version = file.historyXMLVersions.find(v => v.versionID === versionID);
        if (!version) {
            next(new HttpsError('Version not found', 402));
            return;
        }

        // 清空样式数据
        version.styleOfThisVersion = [];

        await filePackage.save();

        res.status(200).json({
            data: {
                message: "All styles deleted successfully"
            }
        });
    }
    catch (error) {
        next(error);
    }
}

exports.editStyleByIdInCurrentVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID,
            styleID,
            data
        } = req.body;

        const filePackage = await FilePackage.findOne({ filePackageID: filePackageID, userID: userID });
        if (!filePackage) {
            next(new HttpsError('File package not found', 402));
            return;
        }

        const file = filePackage.files.find(f => f.fileID === fileID);
        if (!file) {
            next(new HttpsError('File not found', 402));
            return;
        }

        const version = file.historyXMLVersions.find(v => v.versionID === versionID);
        if (!version) {
            next(new HttpsError('Version not found', 402));
            return;
        }

        const style = version.styleOfThisVersion.find(s => s.styleID === styleID);
        if (!style) {
            next(new HttpsError('Style not found', 402));
            return;
        }

        // 更新样式数据
        style.styleName = data.styleName;
        style.data = data.data;

        await filePackage.save();

        res.status(200).json({
            data: {
                message: "Style updated successfully"
            }
        });
    } catch (error) {
        next(error);
    }
}

exports.editStyleInCurrentVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID,
            data
        } = req.body;

        const filePackage = await FilePackage.findOne({filePackageID: filePackageID, userID: userID});
        if (!filePackage) {
            next(new HttpsError('File package not found', 402));
            return;
        }

        const file = filePackage.files.find(f => f.fileID === fileID);
        if (!file) {
            next(new HttpsError('File not found', 402));
            return;
        }

        const version = file.historyXMLVersions.find(v => v.versionID === versionID);
        if (!version) {
            next(new HttpsError('Version not found', 402));
            return;
        }

        for (const [styleID, styleData] of Object.entries(data)) {
            const style = version.styleOfThisVersion.find(s => s.styleID === styleID);
            if (!style) {
                next(new HttpsError(`Style with ID ${styleID} not found`, 402));
                return;
            }

            style.styleName = styleData.styleName;
            style.data = styleData.data;
        }

        await filePackage.save();

        res.status(200).json({
            data: {
                message: "Styles updated successfully"
            }
        });
    } catch (error) {
        next(error);
    }
}


