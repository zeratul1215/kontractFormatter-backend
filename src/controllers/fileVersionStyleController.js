const UserData = require("../models/UserData");
const FilePackage = require("../models/FilePackage");
const HttpsError = require("../utils/HttpsError");
const { v4: uuidv4 } = require('uuid');

exports.getStylesAndSectionsIncurrentVersion = async(req, res, next) => {
    try {
        const { filePackageID, fileID, versionID } = req.params;
        const userID = req.user.userID;

        const result = await getVersion(filePackageID, fileID, versionID, userID);
        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

        const stylesData = {};
        version.styleOfThisVersion.forEach(style => {
            stylesData[style.styleID] = {
                styleName: style.styleName,
                data: style.data
            };
        });

        const sectionsData = {};
        version.sectionsOfThisVersion.forEach(section => {
            sectionsData[section.sectionID] = {
                sectionName: section.sectionName,
                data: section.data
            }
        });

        res.status(200).json({
            data: {
                stylesData: stylesData,
                sectionsData: sectionsData
            }
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

        const result = await getVersion(filePackageID, fileID, versionID, userID);
        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

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

        const result = await getVersion(filePackageID, fileID, versionID, userID);
        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

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

exports.createSectionInCurrentVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID,
            sectionName
        } = req.body;

        const result = await getVersion(filePackageID, fileID, versionID, userID);
        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

        // 检查section名称是否已存在
        const section = version.sectionsOfThisVersion.find(s => s.sectionName === sectionName);
        if (section) {
            next(new HttpsError('Section already exists', 402));
            return;
        }

        // 创建新的section对象，设置默认值
        const newSection = {
            sectionID: uuidv4(),
            sectionName: sectionName,
            data: {
                hasHeader: false,
                hasFooter: false,
                headerLinkedStyleID: '',
                footerLinkedStyleID: '',
                headerContent: '',
                footerContent: '',
                pageNumberOn: false,
                pageNumberLocation: 'footer',
                pageNumberFormer: '',
                pageNumberLatter: '',
                pageNumberFormat: 'Arabic'
            }
        }

        version.sectionsOfThisVersion.push(newSection);
        await filePackage.save();

        res.status(200).json({
            data: {
                message: "success",
                sectionID: newSection.sectionID
            }
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteSectionInCurrentVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID,
            sectionID
        } = req.body;

        const result = await getVersion(filePackageID, fileID, versionID, userID);
        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

        const sectionIndex = version.sectionsOfThisVersion.findIndex(s => s.sectionID === sectionID);
        if (sectionIndex === -1) {
            next(new HttpsError('Section not found', 402));
            return;
        }

        version.sectionsOfThisVersion.splice(sectionIndex, 1);
        await filePackage.save();

        res.status(200).json({
            data: {
                message: "Section deleted successfully"
            }
        });
    } catch (error) {
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
        
        const result = await getVersion(filePackageID, fileID, versionID, userID);
        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

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

exports.eraseAllSectionsInCurrentVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID
        } = req.body;
        
        const result = await getVersion(filePackageID, fileID, versionID, userID);
        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

        version.sectionsOfThisVersion = [];
        await filePackage.save();

        res.status(200).json({
            data: {
                message: "All sections deleted successfully"
            }
        });
    } catch (error) {
        next(error);
    }
}

exports.eraseAllStylesAndSectionsInCurrentVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID
        } = req.body;
        
        const result = await getVersion(filePackageID, fileID, versionID, userID);
        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

        // 清空样式数据
        version.styleOfThisVersion = [];
        // 清空section数据
        version.sectionsOfThisVersion = [];

        await filePackage.save();

        res.status(200).json({
            data: {
                message: "All styles and sections deleted successfully"
            }
        });
    }
    catch (error) {
        next(error);
    }
}

exports.copyStyleFromStyleGroupInCurrentVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID,
            styleGroupID
        } = req.body;
        
        const result = await getVersion(filePackageID, fileID, versionID, userID);
        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

        const userData = await UserData.findOne({ userID: userID });
        if (!userData) {
            next(new HttpsError('User not found', 401));
            return;
        }

        const styleGroup = userData.styleGroups.find(group => group.styleGroupID === styleGroupID);
        if (!styleGroup) {
            next(new HttpsError('Style group not found', 402));
            return;
        }

        styleGroup.styles.forEach(style => {
            const newStyle = {
                styleID: uuidv4(),
                styleName: style.styleName,
                data: style.data
            };
            version.styleOfThisVersion.push(newStyle);
        });

        await filePackage.save();

        res.status(200).json({
            data: {
                message: "Styles copied successfully"
            }
        });
    }
    catch (error) {
        next(error);
    }
}

exports.copySectionFromStyleGroupInCurrentVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID,
            styleGroupID
        } = req.body;
        
        const result = await getVersion(filePackageID, fileID, versionID, userID);
        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

        const userData = await UserData.findOne({ userID: userID });
        if (!userData) {
            next(new HttpsError('User not found', 401));
            return;
        }

        const styleGroup = userData.styleGroups.find(group => group.styleGroupID === styleGroupID);
        if (!styleGroup) {
            next(new HttpsError('Style group not found', 402));
            return;
        }

        styleGroup.sections.forEach(section => {
            const newSection = {
                sectionID: uuidv4(),
                sectionName: section.sectionName,
                data: section.data
            };
        });

        await filePackage.save();

        res.status(200).json({
            data: {
                message: "Sections copied successfully"
            }
        });
    } catch (error) {
        next(error);
    }
}

exports.copyStyleAndSectionFromStyleGroupInCurrentVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID,
            styleGroupID
        } = req.body;
        
        const result = await getVersion(filePackageID, fileID, versionID, userID);
        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

        const userData = await UserData.findOne({ userID: userID });
        if (!userData) {
            next(new HttpsError('User not found', 401));
            return;
        }

        const styleGroup = userData.styleGroups.find(group => group.styleGroupID === styleGroupID);
        if (!styleGroup) {
            next(new HttpsError('Style group not found', 402));
            return;
        }

        styleGroup.styles.forEach(style => {
            const newStyle = {
                styleID: uuidv4(),
                styleName: style.styleName,
                data: style.data
            };
            version.styleOfThisVersion.push(newStyle);
        });

        styleGroup.sections.forEach(section => {
            const newSection = {
                sectionID: uuidv4(),
                sectionName: section.sectionName,
                data: section.data
            };
        });

        await filePackage.save();

        res.status(200).json({
            data: {
                message: "Styles and sections copied successfully"
            }
        });
    } catch (error) {
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

        const result = await getVersion(filePackageID, fileID, versionID, userID);
        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

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

        const result = await getVersion(filePackageID, fileID, versionID, userID);
        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

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

exports.editSectionInCurrentVersion = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID,
            data
        } = req.body;

        const result = await getVersion(filePackageID, fileID, versionID, userID);
        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

        for (const [sectionID, sectionData] of Object.entries(data)) {
            const section = version.sectionsOfThisVersion.find(s => s.sectionID === sectionID);
            if (!section) {
                next(new HttpsError(`Section with ID ${sectionID} not found`, 402));
                return;
            }

            section.sectionName = sectionData.sectionName;
            section.data = sectionData.data;
        }

        await filePackage.save();

        res.status(200).json({
            data: {
                message: "Sections updated successfully"
            }
        });
    } catch (error) {
        next(error);
    }
}

exports.restoreStyleDataToSaved = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID
        } = req.body;

        const result = await getVersion(filePackageID, fileID, versionID, userID);

        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;

        version.styleOfThisVersion = version.savedStylesOfThisVersion.map(style => ({
            styleID: style.styleID,
            styleName: style.styleName,
            data: {
                ...style.data
            }
        }));

        await filePackage.save();

        res.status(200).json({
            data: {
                message: "Style data restored successfully"
            }
        });
    } catch (error) {
        next(error);
    }
}

exports.restoreSectionDataToSaved = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            filePackageID,
            fileID,
            versionID
        } = req.body;

        const result = await getVersion(filePackageID, fileID, versionID, userID);

        if (result instanceof HttpsError) {
            next(result);
            return;
        }

        const { filePackage, version } = result;
        version.sectionsOfThisVersion = version.savedSectionsOfThisVersion.map(section => ({
            sectionID: section.sectionID,
            sectionName: section.sectionName,
            data: {
                ...section.data
            }
        }));

        await filePackage.save();

        res.status(200).json({
            data: {
                message: "Section data restored successfully"
            }
        });
    } catch (error) {
        next(error);
    }
}

const getVersion = async (filePackageID, fileID, versionID, userID) => {
    const filePackage = await FilePackage.findOne({filePackageID: filePackageID, userID: userID});
    if (!filePackage) {
        return new HttpsError('File package not found', 402);
    }

    const file = filePackage.files.find(f => f.fileID === fileID);
    if (!file) {
        return new HttpsError('File not found', 402);
    }

    const version = file.historyXMLVersions.find(v => v.versionID === versionID);
    if (!version) {
        return new HttpsError('Version not found', 402);
    }

    return { filePackage, version };
}
