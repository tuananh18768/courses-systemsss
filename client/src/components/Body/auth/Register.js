import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {showErrMsg, showSuccessMsg} from '../../utils/Notification/Notification'
import {dispatchLogin} from '../../../redux/actions/authAction'
import {useDispatch} from 'react-redux'
import {isEmpty, isEmail, isPassword,isCf_pass } from '../../utils/validation/validation'
const initialState = {
    name: '',
    email: '',
    password: '',
    cf_password: '',
    error: '',
    success: '',
}
export default function Register() {
  const [user, setUser] = useState(initialState)


  const {name, email, password, cf_password, error, success } = user
  const handleChange = (e)=>{
      const {name, value} = e.target
      setUser({...user, [name]: value, error: '', success: ''})
  }

  const handleSubmit = async (e)=>{
      e.preventDefault()
      if(!isEmpty(name) || !isEmpty(password)){
          return setUser({...user, error: 'Please fill in all fields.', success: ''})
      }
      if(!isEmail(email)){
        return setUser({...user, error: 'Invalid email.', success: ''})
      }
      if(!isPassword(password)){
        return setUser({...user, error: 'Password must be at least 6 characters.', success: ''})
      }
      if(!isCf_pass(password,cf_password)){
        return setUser({...user, error: 'Password is not match!!', success: ''})
      }
      try {
          const res = await axios.post('http://localhost:5000/user/register', {name, email, password})
          setUser({...user, error: '', success: res.data.msg})
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
          <label>Name</label>
      <div className="user-box">
          <input type="text"   id="email" name="name"
            value={name} 
            onChange={(e)=>{handleChange(e)}}
            />
        </div>
          <label>Email Address</label>
        <div className="user-box">
          <input type="text"   id="name" name="email"
            value={email} 
            onChange={(e)=>{handleChange(e)}}
            />
        </div>
          <label>Password</label>
        <div className="user-box">
          <input type="password" id="password"  name="password"
            value={password} 
              onChange={(e)=>{handleChange(e)}}
            />
        </div>
          <label>Confirm Password</label>
        <div className="user-box">
          <input type="password" id="cf_password"  name="cf_password"
            value={cf_password} 
              onChange={(e)=>{handleChange(e)}}
            />
        </div>
        <div className="row">
          
          <button onSubmit={(e)=>{handleSubmit(e)}} className="button"type="submit"> 
            Register
          </button>
          </div>
      </form>
      <p>Already an account? <Link to="/login">Login</Link></p>
    </div>
  )
}
