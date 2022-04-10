import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import {showErrMsg, showSuccessMsg} from '../../utils/Notification/Notification'
import {dispatchLogin} from '../../../redux/actions/authAction'
import {useDispatch} from 'react-redux'
const initialState = {
  email: '',
  password: '',
  error: '',
  success: '',
}
export default function Login() {
  const [user, setUser] = useState(initialState)
  const dispatch = useDispatch()
  const history = useHistory()

  const { email, password, error, success } = user
  const handleChange = (e)=>{
      const {name, value} = e.target
      setUser({...user, [name]: value, error: '', success: ''})
  }

  const handleSubmit = async (e)=>{
      e.preventDefault()
      try {
        const res = await axios.post('/user/login', {email, password}, { withCredentials: true })
        setUser({...user, error: '', success: res.data.msg})
        localStorage.setItem('firstLogin', true)
        dispatch(dispatchLogin())
        history.push("/home")
      } catch (err) {
        err.response.data.msg &&
        setUser({...user, error: err.response.data.msg, success: ''})
      }
  }
  return (
    <div className="login_page">
      <h2>Login</h2>
      {error && showErrMsg(error)}
      {success && showSuccessMsg(success)}
      <form onSubmit={handleSubmit}>
          <label>Email Address</label>
        <div className="user-box">
          <input type="text" required  id="email" name="email"
            value={email} 
            onChange={(e)=>{handleChange(e)}}
            />
        </div>
          <label>Password</label>
        <div className="user-box">
          <input type="text" id="password" required name="password"
            value={password} 
              onChange={(e)=>{handleChange(e)}}
            />
        </div>
        <div className="row">
          
          <button onSubmit={(e)=>{handleSubmit(e)}} className="button"type="submit"> 
            Login
          </button>
          <Link className="forgot" to="/forgot_password">Forgot your password</Link>
          </div>
      </form>
      <p> New user? <Link to="/register">Register</Link></p>
    </div>
  )
}
