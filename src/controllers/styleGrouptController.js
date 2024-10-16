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
            styles: []
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

exports.getAllStyleGroups = async (req, res, next) => {
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
