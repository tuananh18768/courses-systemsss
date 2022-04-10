import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import { showErrMsg, showSuccessMsg } from '../../utils/Notification/Notification'
import { dispatchLogin } from '../../../redux/actions/authAction'
import { useDispatch } from 'react-redux'
import {errorNotifi} from '../../utils/Notification/Notification'
import style from './auth.module.css'
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
  const handleChange = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value, error: '', success: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/user/login', { email, password }, { withCredentials: true })
      setUser({ ...user, error: '', success: res.data.msg })
      localStorage.setItem('firstLogin', true)
      dispatch(dispatchLogin())
      history.push("/home")
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, error: err.response.data.msg, success: '' })
    }
  }
  return (
    <div className={style.align}>
    <h2>Login</h2>
       {error && showErrMsg(error)}
       {success && showSuccessMsg(success)}
      <div className={style.grid}>
        <form onSubmit={handleSubmit} className={`${style.forms} ${style.login}`}>
          <div className={style.form__field}>
            <label htmlFor="login__username"><svg className={style.icon}>
              <use xlinkHref="#icon-user" />
            </svg><span className={style.hidden}>Email</span></label>
            <input style={{height: '100%', border: 0}} autoComplete="username"  type="text"  className="form__input" placeholder="Email" required  id="email" name="email" value={email}  
            onChange={(e)=>{handleChange(e)}} />
          </div>
          <div className={style.form__field}>
            <label htmlFor="login__password"><svg className={style.icon}>
              <use xlinkHref="#icon-lock" />
            </svg><span className={style.hidden}>Password</span></label>
            <input style={{height: '100%', border: 0}}  type="password" className="form__input" placeholder="Password" id="password" required name="password" value={password}  onChange={(e)=>{handleChange(e)}}  />
          </div>
          <button onSubmit={(e)=>{handleSubmit(e)}} className={style.LoginBtn}> 
             Login
             </button>
        </form>
        <Link className={style.forgot} to="/forgot_password">Forgot password? <svg className={style.icon}>
        </svg></Link>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="icons">
        <symbol id="icon-arrow-right" viewBox="0 0 1792 1792">
          <path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z" />
        </symbol>
        <symbol id="icon-lock" viewBox="0 0 1792 1792">
          <path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z" />
        </symbol>
        <symbol id="icon-user" viewBox="0 0 1792 1792">
          <path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z" />
        </symbol>
      </svg>
    </div>
  )
}
