const mongoose = require("mongoose");
const aiSchema = new mongoose.Schema({

    question: {
        type: String,
        trim: true,
        required: true
    },
    answer: {
        type: String,
        trim: true,
        required: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },


});

aiSchema.index({ problemId: 1, question: 1 }, { unique: true });

module.exports = mongoose.model("Aimodel", aiSchema);