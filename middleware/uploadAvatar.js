const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploadAvatar')
    },
    filename: function(req, file, cb) {
        // const extension = MIME_TYPES[file.mimetype];
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})
const filefilter = (req, file, cb) => {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype === 'image/jpg') {
        cb(null, false)
    } else {
        cb(null, true)
    }
}
const uploadAvatar = multer({ storage: storage, fileFilter: filefilter, dest: 'upload/' })

module.exports = { uploadAvatar }