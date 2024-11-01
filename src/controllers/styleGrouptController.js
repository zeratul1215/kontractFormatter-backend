const { v4: uuidv4 } = require('uuid');
const UserData = require('../models/UserData');
const HttpsError = require('../utils/HttpsError');

exports.createStyleGroup = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const { styleGroupName } = req.body;

        const newStyleGroup = {
            styleGroupID: uuidv4(),
            styleGroupName: styleGroupName,
            styles: [],
            sections: []
        }

        const userData = await UserData.findOne({ userID: userID });

        if(!userData){
            next(new HttpsError('User not found', 401));
        }

        userData.styleGroups.push(newStyleGroup);
        await userData.save();

        res.status(200).json({
            message: 'Style group created successfully',
            styleGroupID: newStyleGroup.styleGroupID
        });
    }
    catch (error) {
        next(error);
    }
}

exports.deleteStyleGroup = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const { styleGroupID } = req.body;
        
        const userData = await UserData.findOne({ userID: userID });

        if(!userData){
            next(new HttpsError('User not found'), 401);
        }

        const styleGroupIndex = userData.styleGroups.findIndex(styleGroup => styleGroup.styleGroupID === styleGroupID);

        if (styleGroupIndex === -1) {
            next(new HttpsError('Style group not found'),402);
        }

        userData.styleGroups.splice(styleGroupIndex, 1);
        await userData.save();

        res.status(200).json({
            message: 'Style group deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
}

exports.getNameOfAllStyleGroups = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        
        const userData = await UserData.findOne({ userID: userID });

        if (!userData) {
            next(new Error('User not found'), 401);
        }

        const styleGroupsData = {};
        userData.styleGroups.forEach(styleGroup => {
            styleGroupsData[styleGroup.styleGroupID] = styleGroup.styleGroupName;
        });

        res.status(200).json({
            data: {
                message: 'success',
                data: styleGroupsData
            }
        });
    } catch (error) {
        next(error);
    }
}

exports.getStyleGroupDataByID = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const { styleGroupID } = req.params;

        const userData = await UserData.findOne({ userID: userID });
        if (!userData) {
            next(new HttpsError('User not found', 401));
            return;
        }

        const styleGroup = userData.styleGroups.find(styleGroup => styleGroup.styleGroupID === styleGroupID);
        if (!styleGroup) {
            next(new HttpsError('Style group not found', 402));
            return;
        }

        res.status(200).json({
            data: {
                message: 'success',
                data: styleGroup
            }
        });

    } catch (error) {
        next(error);
    }
}

// exports.createStyleInGroup = async (req, res, next) => {
//     try {
//         const userID = req.user.userID;
//         const { styleGroupName, style } = req.body;
        
        
//     }
//     catch (error) {
//         next(error);
//     }
// }


exports.saveCurrentStylesAsGroup = async (req, res, next) => {
    try {
        const userID = req.user.userID;
        const {
            styleGroupName,
            styleData,
            sectionData
        } = req.body;
        // 查找用户数据
        const userData = await UserData.findOne({ userID: userID });
        if (!userData) {
            next(new HttpsError('User not found', 401));
            return;
        }

        // 检查styleGroupName是否已被使用
        const existingGroup = userData.styleGroups.find(group => group.styleGroupName === styleGroupName);
        if (existingGroup) {
            next(new HttpsError('Style group name already exists', 402));
            return;
        }

        // 创建新的样式组
        const newStyleGroup = {
            styleGroupID: uuidv4(),
            styleGroupName: styleGroupName,
            styles: [],
            sections: []
        };

        // 将data中的样式添加到样式组中
        for (const [styleID, data] of Object.entries(styleData)) {
            const newStyle = {
                styleID: styleID,
                styleName: data.styleName,
                data: data.data
            };
            newStyleGroup.styles.push(newStyle);
        }

        // 将data中的段落添加到样式组中
        for (const [sectionID, data] of Object.entries(sectionData)) {
            const newSection = {
                sectionID: sectionID,
                sectionName: data.sectionName,
                data: data.data
            };
            newStyleGroup.sections.push(newSection);
        }

        // 将新的样式组添加到用户数据中
        userData.styleGroups.push(newStyleGroup);
        await userData.save();

        res.status(200).json({
            data: {
                message: "success"
            }
        });
    } catch (error) {
        next(error);
    }
}