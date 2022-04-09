const mongoose = require('mongoose')
const { Schema } = mongoose;
const Timestamps = require('mongoose-timestamp')

const categoryShema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please enter your name!'],
        trim: true
    },
    manger_cate: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    departments: {
        type: Schema.Types.ObjectId,
        ref: 'Department'
    },
    // set_deadlineSecond: {
    //     type: String,
    //     min: Date.now()
    // }
}, {
    timestamps: true,
})
const categoryModel = mongoose.model("Category", categoryShema)


module.exports = categoryModel