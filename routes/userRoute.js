const router = require('express').Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authManager = require('../middleware/manager')
const { checkTimeDeadline } = require('../middleware/checkTimeDeadline')

router.post('/register', userController.register)

router.post('/activation', userController.activateEmail)

router.post('/login', userController.login)

router.post('/refresh_token', userController.getAccessToken)

router.post('/forgot', userController.forgotPassword)

router.post('/reset', auth, userController.resetPassword)

router.get('/infor', auth, userController.getUserInfor)

router.get('/all_infor', auth, authAdmin, userController.getUserAllInfor)

router.get('/logout', userController.logout)

router.patch('/update_infor', auth, userController.updateInfor)

router.patch('/update_role/:id', auth, authAdmin, userController.updateUserRole)

router.delete('/delete_user/:id', auth, authAdmin, userController.deleteUser)

router.post('/add_category', auth, authManager, userController.addCategory)

// router.put('/set_time_category/:id', auth, authManager, checkTimeDeadline, userController.setTimeCategory)

router.delete('/delete_category/:id', auth, authManager, userController.deleteCategory)

router.patch('/update_category/:id', auth, authManager, userController.updateCategory)

router.get('/getAll_category', auth, userController.getAllCategory)

router.post('/add_department', auth, authAdmin, userController.addDepartment)

router.put('/update_department/:id', auth, authAdmin, userController.updateDepartment)

router.get('/get_allDeparment', auth, userController.getAllDepartment)

router.get('/get_departmentOne/:id', auth, authManager, userController.getOneDepartment)

// router.get('/get_departmentPost/:id', auth, authAdmin, userController.getOneCateOfDepartment)

router.delete('/delete_department/:id', auth, authAdmin, userController.deleteDepartment)

router.get('/dashboard/', auth, authManager, userController.dashboard)






module.exports = router