const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { styleSchema, numberingStyleSchema, sectionSchema } = require('./styleSchema');

const styleGroupSchema = new Schema({
    styleGroupID: { type: String, required: true},
    styleGroupName: { type: String, required: true},
    styles: [styleSchema],
    sections: [sectionSchema]
});


const userDataSchema = new Schema({
    userID: {
        type: String,
        ref: 'AuthUser',
        required: true,
        unique: true
    },
    filePackages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FilePackage'
    }],
    styleGroups: [styleGroupSchema],
    numberingStyles: [numberingStyleSchema],
});

module.exports = mongoose.model('UserData', userDataSchema);