const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please enter your name!'],
        trim: true
    },
    email: {
        type: String,
        require: [true, 'Please enter your email!'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: [true, 'Please enter your password!'],
    },
    role: {
        type: Number,
        default: 0 // 0 = user, 1 = admin, 2 = manager, 3 = coordinator
    },
    avatar: {
        type: String,
        default: "https://kenh14cdn.com/2020/10/4/photo-1-1601813372017758166996.jpg"
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("Users", userSchema)