const Users = require('../models/userModel')

const authCoordinatorr = async(req, res, next) => {
    try {
        const user = await Users.findOne({ _id: req.user.id })

        if (user.role !== 3)
            return res.status(500).json({ msg: "Coordinator resources access denied." })

        next()
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

module.exports = authCoordinatorr