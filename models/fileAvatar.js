const mongoose = require('mongoose')
const { Schema } = mongoose;
const userAvatarSchema = new mongoose.Schema({
    avatarUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    fileName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    fileSize: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model("avatarUser", userAvatarSchema)