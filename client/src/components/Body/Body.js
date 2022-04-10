import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ActivationEmail from './auth/ActivationEmail'
import Login from './auth/Login'
import Register from './auth/Register'
import {useSelector} from 'react-redux'
import NotFound from '../utils/NotFound/NotFound'
import Content from '../utils/NotFound/Content'
import ForgotPassword from '../Body/auth/ForgotPassword'
import ResertPassword from '../Body/auth/ResertPassword'
// import HeaderBottom from '../Header/HeaderBottom'
// import IdeaStaff from '../Body/iIdeaStaff/IdeaStaff'
// import Pagination from '../Body/Pagination/Pagination'
import Profile from '../Body/Profile/Profile'
import EditUser from './Profile/EditUser'
import uploadIdea from './iIdeaStaff/UploadIdea'
import DetailPost from './iIdeaStaff/DetailPost'
import MangerIdea from './Profile/MangerIdea'
import Dashboard from './Profile/Dashboard'
import ProfileAdmin from './Profile/AdminProfile'
import AdminManagerDepartment from './Profile/AdminManagerDepartment'
import ManagerStaff from './Profile/ManagerStaff'
import ManagerCoordinator from './Profile/ManagerCoordinator'
import ManagerManger from './Profile/ManagerMangerger'

export default function Body() {
  const auth = useSelector(state => state.auth)
  // const ideaStaff = useSelector(state => state.ideaStaff)
  const {isLogged, isAdmin, isManager} = auth

  // console.log(ideaStaff)
  return (
    <main className="main" style={{display: 'inherit'}}>
        <Switch>
         <Route path="/login" component={isLogged? NotFound : Login} exact />
         <Route path="/register" component={isLogged? NotFound : Register} exact />
         <Route path="/forgot_password" component={isLogged? NotFound : ForgotPassword} exact />
         <Route path="/user/activate/:activation_token" component={ActivationEmail} exact />
         <Route path="/user/reset/:token" component={isLogged? NotFound : ResertPassword} exact />
         <Route path="/edit_user/:id" component={isAdmin? EditUser : ResertPassword} exact />
         <Route path="/profile" component={isLogged ? Profile : NotFound} exact />
         <Route path="/profileAdmin" component={isLogged && isAdmin ? ProfileAdmin : NotFound} exact />
         <Route path="/addIdea" component={isLogged ? uploadIdea : NotFound} exact />
         <Route path="/detail_idea/:id" component={isLogged ? DetailPost : NotFound} exact />
         <Route path="/managerIdea" component={isLogged ? MangerIdea : NotFound} exact />
         <Route path="/adminManager" component={isLogged && isAdmin ? AdminManagerDepartment : NotFound} exact />
         <Route path="/dashboard" component={isManager ? Dashboard : NotFound} exact />
         <Route path="/managerStaff" component={isAdmin ? ManagerStaff : NotFound} exact />
         <Route path="/managerCoordinator" component={isAdmin ? ManagerCoordinator : NotFound} exact />
         <Route path="/managerManger" component={isAdmin ? ManagerManger : NotFound} exact />
         <Route path="/home" component={isLogged? Content : Login} exact />
         <Route path="/" component={isLogged? Content : Login} exact />
    </Switch>
</main>
   
  )
}
