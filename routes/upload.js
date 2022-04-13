const router = require('express').Router();
const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth')
const multer = require('multer');
const uploadImage = require('../middleware/uploadImage')
const { upload } = require('../middleware/documentIdea')
const { uploadAvatar } = require('../middleware/uploadAvatar')


router.post('/avater_upload', auth, uploadAvatar.single('file'), uploadImage, uploadController.uploadAvatar)

router.get('/get_avatar', auth, uploadController.getAvatar)

router.post('/upload_idea', auth, upload.array('file', 12), uploadController.uploadIdea)

router.post('/update_idea/:id', auth, upload.array('file', 12), uploadController.updateIdea)

router.delete('/delete_idea/:id', auth, uploadController.deleteIdea)

router.get('/get_idea/:id', auth, uploadController.viewUser, uploadController.getDetailOneIdea)

router.get('/getall_idea', auth, uploadController.getallSingleFiles)

router.post('/get_idea_comment/:id', auth, uploadController.commentIdea)

router.delete('/delete_comment/:id/:comment_id', auth, uploadController.deleteComment)

router.put('/get_idea_like/:id', auth, uploadController.likeIdea)

router.put('/get_idea_dislike/:id', auth, uploadController.dislikeIdea)

router.put('/views/:id', auth, uploadController.viewUser)

router.get('/get_allIdeaStaff', auth, uploadController.getAllIdeaOfUser)

router.get('/downloadZip/', uploadController.downloadZipFile)

router.get('/downloadCsv/', uploadController.downloadCsvFile)

router.put('/anonymously_user/:id', auth, uploadController.anonymouslyUser)

module.exports = router