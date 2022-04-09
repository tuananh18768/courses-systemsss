const mongoose = require('mongoose')
const { Schema } = mongoose;
const mongooseDateFormat = require('mongoose-date-format');
const fileIdea = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    staff_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    email_staff: {
        type: String,
    },
    comments: [{
        users: {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        },
        text: {
            type: String,
            trim: true,
        },
        name: {
            type: String
        },
        avatar: {
            type: String,
        },
        statusComment: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: new Date()
        }
    }],
    likes: [{
        users: {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        },
        date: {
            type: Date,
            default: new Date()
        }
    }],
    dislikes: [{
        users: {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        },
        date: {
            type: Date,
            default: new Date()
        }
    }],
    views: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
    anonymously: {
        type: Boolean,
        default: false
    },
    files: [Object]
}, { timestamps: true })
fileIdea.plugin(mongooseDateFormat)
module.exports = mongoose.model('Document_Idea', fileIdea)