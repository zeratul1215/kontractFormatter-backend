const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const styleSchema = new Schema({
    styleID: { type: String, required: true },
    styleName: { type: String, required: true },
    data: {
        chineseFont: String,
        englishFont: String,
        fontSize: Number,
        bold: Boolean,
        italic: Boolean,
        underline: Boolean,
        color: String,
        alignment: String,
        firstLineIndent: Number,
    }
});

const numberingStyleSchema = new Schema({
    numberingStyleID: { type: String, required: true },
    numberingStyleName: { type: String, required: true },
    data: mongoose.Schema.Types.Mixed
});

module.exports = { styleSchema, numberingStyleSchema };