var multer = require('multer');
// var upload = multer({ dest: 'upload/'});
const MIME_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "doc"
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb) {
        const extension = MIME_TYPES[file.mimetype];
        cb(null, file.fieldname + '-' + Date.now() + "." + extension)
    }
})
const filefilter = (req, file, cb) => {
    if (file.mimetype !== 'application/pdf' && file.mimetype !== 'application/msword' && file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, false)
    } else {
        cb(null, true)
    }
}
const upload = multer({ storage: storage, fileFilter: filefilter, dest: 'upload/' })

module.exports = { upload }