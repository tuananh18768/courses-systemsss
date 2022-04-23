const mongoose = require('mongoose')
const { Schema } = mongoose;
const Timestamps = require('mongoose-timestamp')

const departmentShema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please enter your name!'],
        trim: true
    },
    set_deadline: {
        type: String,
        min: Date.now()
    },
    set_deadlineSecond: {
        type: String,
        min: Date.now()
    }
}, {
    timestamps: true,
})


const departmentModel = mongoose.model("Department", departmentShema)


module.exports = departmentModel