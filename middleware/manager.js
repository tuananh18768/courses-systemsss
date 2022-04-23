const Users = require('../models/userModel')
    // const categoryModel = require('../models/catergories')
const authManager = async(req, res, next) => {
    try {
        console.log(req.user)
        const user = await Users.findOne({ _id: req.user.id })
        if (user.role !== 2) {
            return res.status(500).json({ msg: "Manager resources access denied." })
        }
        next()
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

module.exports = authManager