const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const styleSchema = new Schema({
    styleID: { type: String, required: true },
    styleName: { type: String, required: true },
    data: {
        fontChineseName: String,
        fontEnglishName: String,
        fontSize: Number,
        fontBold: Boolean,
        fontItalic: Boolean,
        fontUnderLine: String,
        fontColor: String,
        formatLineSpacing: Number,
        formatFirstLineIndent: Number,
        formatAlignment: String,
        formatLeftIndent: Number,
        formatRightIndent: Number,
        formatSpaceBefore: Number,
        formatSpaceAfter: Number,
    }
});

const numberingStyleSchema = new Schema({
    numberingStyleID: { type: String, required: true },
    numberingStyleName: { type: String, required: true },
    data: mongoose.Schema.Types.Mixed
});

module.exports = { styleSchema, numberingStyleSchema };