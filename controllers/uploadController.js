const fs = require('fs')
const ManyFileModel = require('../models/fileIdea')
const Department = require('../models/department')
const Users = require('../models/userModel')
const categoryModel = require('../models/catergories')
const UserAvatar = require('../models/fileAvatar')
const sendMailIdea = require('../controllers/sendMailIdea')
const sendMail = require('../controllers/sendMail')
const admzip = require('adm-zip')
const ObjectsToCsv = require('objects-to-csv');

const { CLIENT_URL } = process.env
const uploadAvatar = async(req, res) => {
    try {
        const avatars = await UserAvatar.findOne({ avatarUser: req.user.id })
        if (avatars) {
            await UserAvatar.findByIdAndDelete(avatars._id)
        }
        const file = new UserAvatar({
            avatarUser: req.user.id,
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2)
        })
        await file.save()
        console.log(file)
        res.status(200).json({ msg: 'oke' })

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}
const getAvatar = async(req, res) => {
    try {
        const avatars = await UserAvatar.findOne({ avatarUser: req.user.id })
        res.status(200).json(avatars)
    } catch (error) {
        return res.status(500).json({ msg: err.message })
    }
}
const uploadIdea = async(req, res, next) => {
    try {
        const user = await Users.findById(req.user.id).select('-password')
        const cateTime = await categoryModel.findById(req.body.category)
        const departmentTimes = await Department.findById(cateTime.departments)
        let message = 'Idea submission is overdue!!! '

        if (!cateTime) return res.status(500).json({ msg: 'Category is not available!!!' })
        let statusDeadline = new Date(departmentTimes.set_deadline).getTime() > new Date().getTime()

        if (!statusDeadline) {
            return res.status(404).json({ msg: message })
        } else {
            message = 'Idea submission successfully '
        }
        let filesArray = []
        req.files.forEach(element => {
            const file = {
                fileName: element.originalname,
                filePath: element.path,
                fileType: element.mimetype,
                fileSize: fileSizeFormatter(element.size, 2),
            }
            filesArray.push(file)
        })
        const multipleFiles = new ManyFileModel({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            staff_id: user.id,
            files: filesArray,
            anonymously: req.body.anonymously,
            statusDeadline: statusDeadline ? true : false,
        })
        await multipleFiles.save()
        const url = `${CLIENT_URL}/detail_idea/${multipleFiles._id}`
        sendMailIdea(url, "Staff upload done idea", user.email)
        res.status(200).json({ msg: message })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const updateIdea = async(req, res) => {
    try {
        const cateTime = await categoryModel.findById(req.body.category)
        const departmentTimes = await Department.findById(cateTime.departments)
        let message = 'Idea submission is overdue!!! '
        let statusDeadline = new Date(departmentTimes.set_deadline).getTime() > new Date()

        if (!statusDeadline) {
            return res.status(404).json({ msg: message })
        } else {
            message = 'Idea update successfully '
        }
        let filesArray = []
        req.files.forEach(element => {
            const file = {
                fileName: element.originalname,
                filePath: element.path,
                fileType: element.mimetype,
                fileSize: fileSizeFormatter(element.size, 2),
            }
            filesArray.push(file)
        })
        await ManyFileModel.findByIdAndUpdate({ _id: req.params.id }, {
            title: req.body.title,
            description: req.body.description,
            files: filesArray,
            anonymously: req.body.anonymously,
            category: req.body.category,

        })
        res.status(200).json({ msg: message })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const deleteIdea = async(req, res) => {
    try {
        await ManyFileModel.findByIdAndDelete(req.params.id)
        res.json({ msg: "Delete successfully" })
    } catch (error) {
        return res.status(500).json({ msg: err.message })
    }
}
const getDetailOneIdea = async(req, res) => {
    try {
        let ideaElement = await ManyFileModel.findOne({ _id: req.params.id })
            // let ideaOfuser = {}
        const cate = await categoryModel.findById(ideaElement.category)
        const timeFirst = await Department.findById(cate.departments)
        const user = await Users.findById(ideaElement.staff_id)
        const statusDeadline = new Date(timeFirst.set_deadlineSecond).getTime() > new Date().getTime()
        ideaElement = {...ideaElement._doc, category: cate.name, statusDeadline, staff_id: user.name, email_staff: user.email }

        res.status(200).json(ideaElement)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const getallSingleFiles = async(req, res) => {
    try {
        const files = await ManyFileModel.find()
        const userModel = await Users.find()
        const dataIdea = files.map((element) => {
            const userPost = userModel.find(item => item._id.toString() === element.staff_id.toString())
            return {
                ...element._doc,
                name_user: userPost.name,
                user_avatar: userPost.avatar,

            }
        })
        res.status(200).send(dataIdea)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const commentIdea = async(req, res) => {
    try {
        const user = await Users.findById(req.user.id).select('-password')
        const postComment = await ManyFileModel.findById(req.params.id)
        const userAuthor = await Users.findById(postComment.staff_id)
        const cate = await categoryModel.findById(postComment.category)
        const dateSecond = cate.set_deadlineSecond
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            users: user.id,
            statusComment: req.body.checkUser
        }

        postComment.comments.unshift(newComment)
        await postComment.save()
        const url = `${CLIENT_URL}/detail_idea/${req.params.id}`
        sendMail(userAuthor.email, url, "Come to post")
        res.status(200).json(postComment.comments)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const deleteComment = async(req, res) => {
    try {
        const params = await ManyFileModel.findById(req.params.id)
        const comment = await params.comments.find(comment => comment.id === req.params.comment_id)
        if (!comment) return res.status(404).json({ msg: 'Comment dose not exit!!!' })
        if (String(comment.users) !== req.user.id) return res.status(401).json({ msg: 'User not authorized' })

        const indexLike = params.comments.map(com => String(com.users).indexOf(req.user.id))
        params.comments.splice(indexLike, 1)
        await params.save()
        res.json(params.comments)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const likeIdea = async(req, res) => {
    try {
        const params = await ManyFileModel.findById(req.params.id)
        const likesAble = params.dislikes.findIndex(like => like.users.toString() === req.user.id)
        const userLikes = params.likes.findIndex(like => like.users.toString() === req.user.id)
        if (userLikes !== -1) {
            params.likes.splice(userLikes, 1)
            params.save()
            return res.json({ msg: 'Remove like successfully' })
        }
        if (likesAble !== -1) {
            params.dislikes.splice(likesAble, 1)
        }
        params.likes.unshift({ users: req.user.id })
        await params.save()
        return res.json({ msg: 'Like successfully' })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const dislikeIdea = async(req, res) => {
    try {
        const params = await ManyFileModel.findById(req.params.id)
        const likesAble = params.likes.findIndex(like => like.users.toString() === req.user.id)
        const userDislike = params.dislikes.findIndex(like => like.users.toString() === req.user.id)
        if (userDislike !== -1) {
            params.dislikes.splice(userDislike, 1)
            params.save()
            return res.json({ msg: 'Remove Dislike successfully' })
        }
        if (likesAble !== -1) {
            params.likes.splice(likesAble, 1)
        }
        params.dislikes.unshift({ users: req.user.id })

        await params.save()
        return res.json({ msg: 'Dislike successfully' })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const viewUser = async(req, res, next) => {
    try {
        const idea = await ManyFileModel.findById(req.params.id)
        if (idea && !idea.views.find(e => e.toString() === req.user.id)) {
            idea.views.push(req.user.id);
            idea.save();
        }
        next()
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const getAllIdeaOfUser = async(req, res) => {
    try {
        let ideaOfuser = []
        const doc = await ManyFileModel.find({ staff_id: req.user.id })
        ideaOfuser = await Promise.all(doc.map(async(current) => {
            const cate = await categoryModel.findById(current.category)
            const timeFirst = await Department.findById(cate.departments)
            const statusDeadline = new Date(timeFirst.set_deadline).getTime() > new Date().getTime()
            return {...current._doc, category: cate.name, statusDeadline }
        }))
        res.json(ideaOfuser)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const downloadZipFile = async(req, res) => {
    try {
        const doc = await ManyFileModel.find()
        const file = doc.map(e => e.files).reduce((acc, currentValue) => acc.concat(currentValue), [])
        const zip = new admzip()
        file.forEach(fil => {
            console.log(fil.filePath)
            zip.addLocalFile(fil.filePath)
        })
        const outputPath = "/" + Date.now() + "output.zip"
        fs.writeFileSync(outputPath, zip.toBuffer())
        res.setHeader('Content-disposition', 'attachment; filename=' + outputPath);
        res.download(outputPath, (err) => {
            if (err) {
                res.send("Error in downloading zip file")
            }
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const downloadCsvFile = async(req, res) => {
    try {
        const doc = await ManyFileModel.find()
        let ideaOfuser = []
        ideaOfuser = await Promise.all(doc.map(async(current) => {
            const cate = await categoryModel.findById(current.category)
            const timeFirst = await Department.findById(cate.departments)
            const user = await Users.findById(current.staff_id)
            const statusDeadline = new Date(timeFirst.set_deadline).getTime() > new Date().getTime()
            return {...current._doc, category: cate.name, statusDeadline, staff_id: user.name, email_staff: user.email }
        }))
        const dataFinal = []
        ideaOfuser.forEach((current) => {
            dataFinal.push({ Id: `${current._id}`, Title: `${current.title}`, Description: `${current.description}`, StaffName: `${current.staff_id}`, StaffEmail: `${current.email_staff}`, Category: `${current.category}`, LikesCount: `${current.likes.length}`, DislikesCount: `${current.dislikes.length}`, CommentsCount: `${current.comments.length}`, Status: `${current.statusDeadline}`, CreatedAt: `${current.createdAt}` }, );
        })
        const Csv = new ObjectsToCsv(dataFinal)

        await Csv.toDisk('./test.csv')

        res.download("./test.csv", () => {
            fs.unlinkSync("./test.csv")
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const anonymouslyUser = async(req, res) => {
    try {
        const doc = await ManyFileModel.find()
        const { check } = req.body
        await ManyFileModel.findByIdAndUpdate({ _id: req.params.id }, {
            anonymously: check ? true : false,
        })
        res.status(200).json({ msg: "Set Anonymously successfully" })
            // res.json(doc)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const removeImg = function(patchFile) {
    fs.unlink(patchFile, err => {
        if (err) throw err;
    })
}
const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) {
        return '0 Bytes'
    }
    const dm = decimal || 2
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB']
    const index = Math.floor(Math.log(bytes) / Math.log(1000))
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + '-' + sizes[index]
}
module.exports = {
    uploadAvatar,
    uploadIdea,
    getallSingleFiles,
    getDetailOneIdea,
    commentIdea,
    likeIdea,
    dislikeIdea,
    deleteComment,
    updateIdea,
    deleteIdea,
    viewUser,
    getAllIdeaOfUser,
    downloadZipFile,
    downloadCsvFile,
    anonymouslyUser,
    getAvatar
}