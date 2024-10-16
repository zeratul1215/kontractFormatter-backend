const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { styleSchema, numberingStyleSchema } = require('./styleSchema');


const fileVersionSchema = new Schema({
    versionID: { type: String, required: true},
    versionName: { type: String, required: true},
    versionXML: { type: String, required: true},
    updatedAt: { type: Date, required: true, default: Date.now},
    styleOfThisVersion: [styleSchema],
    numberingStyleOfThisVersion: numberingStyleSchema,
    // 之后确认后再进行修改
    sectionInfo: { type: mongoose.Schema.Types.Mixed, required: true},
});

fileVersionSchema.pre('save', function(next){
    this.updatedAt = new Date();
    next();
});

const fileSchema = new Schema({
    fileID: { type: String, required: true},
    fileName: { type: String, required: true},
    currentVersionID: { type: String, required: true},
    historyXMLVersions: [fileVersionSchema],
});

const filePackageSchema = new Schema({
    filePackageID: { type: String, required: true},
    filePackageName: { type: String, required: true},
    userID: { type: String, required: true, ref: 'UserData'},
    files: [fileSchema],
});

module.exports = mongoose.model('FilePackage', filePackageSchema);
