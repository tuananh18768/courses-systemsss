import { combineReducers } from 'redux'
import auth from './authReducer'
import token from './tokenReducer'
import users from './userReducer'
import category from './categoryReducer'
import ideaStaff from './ideaStaffReducer'
import postDetail from './detailPostReducer'
import allIdeaOfStaff from './allIdeaOfStaff'
import dashboard from './dashboardReducer'
import depatment from './departmentReducer'

export default combineReducers({
    auth,
    token,
    users,
    category,
    ideaStaff,
    postDetail,
    allIdeaOfStaff,
    dashboard,
    depatment,
})