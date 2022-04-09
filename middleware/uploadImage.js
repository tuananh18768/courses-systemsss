const fs = require('fs');

module.exports = async function(req, res, next) {
    try {
        if (!req.file || Object.keys(req.file).length == 0) {
            return res.status(404).json({ msg: "not file upload" });
        }
        const file = req.file;
        if (file.size > 1024 * 1024) {
            removeImg("public/uploads/" + file.filename);
            return res.status(404).json({ msg: "Size to large" });
        }
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeImg("public/uploads/" + file.filename);
            return res.status(404).json({ msg: "file is not format" });
        }
        next()
    } catch (err) {
        return res.status(404).json({ msg: err.message });
    }
}
const removeImg = function(patchFile) {
    fs.unlink(patchFile, err => {
        if (err) throw err;
    })
}