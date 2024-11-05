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

const sectionSchema = new Schema({
    sectionID: { type: String, required: true },
    sectionName: { type: String, required: true },
    data: {
        hasHeader: Boolean,
        hasFooter: Boolean,
        headerLinkedStyleID: String,
        footerLinkedStyleID: String,
        headerContent: String,
        footerContent: String,
        pageNumberOn: Boolean,
        pageNumberLocation: String, // 页码位置 header/footer
        pageNumberFormer: String, // 页码前缀
        pageNumberLatter: String, // 页码后缀
        pageNumberFormat: String, // Arabic, Roman, Chinese
        // startFromOne: Boolean,
    }
});

const numberingStyleSchema = new Schema({
    numberingStyleID: { type: String, required: true },
    numberingStyleName: { type: String, required: true },
    data: mongoose.Schema.Types.Mixed
});

module.exports = { styleSchema, numberingStyleSchema, sectionSchema };