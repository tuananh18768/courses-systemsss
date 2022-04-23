const checkTimeDeadline = (req, res, next) => {
    try {
        const { set_deadline } = req.body
        const currentDate = new Date()
        const deadline = new Date(set_deadline)

        // console.log(deadline.getTime(), currentDate.getTime())
        if (deadline.getTime() < currentDate.getTime()) {
            return res.status(404).json({ msg: "Date over date now invalid!!!" })
        }
        next()
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
module.exports = {
    checkTimeDeadline
}