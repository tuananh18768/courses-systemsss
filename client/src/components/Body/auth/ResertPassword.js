import React, { useState } from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import {showErrMsg, showSuccessMsg} from '../../utils/Notification/Notification'
import {isPassword, isCf_pass} from '../../utils/validation/validation'


const initialState = {
    password: '',
    cf_password: '', 
    error: '',
    success: '',
}
function ResertPassword() {
    const {token} =useParams()
    const [data, setData] = useState(initialState)

    const {password, cf_password, error, success} = data

    const handleChangeInput = (e)=>{
        const {name, value} = e.target
        setData({...data, [name]:value, error: '', success: ''})
    }
    const handleResetPass = async (e)=>{
        e.preventDefault()
        if(!isPassword(password)){
            setData({...data, error: 'Password must be at least 6 characters', success: ''})
            return
        }
        if(!isCf_pass(password, cf_password)){
            setData({...data, error: 'Password is not match!!', success: ''})
            return
        }
        try {
            const res = await axios.post('/user/reset',{password}, {headers: {Authorization:token}} )
            return  setData({...data, error: '', success: res.data.msg})
        } catch (error) {
            return error.response.msg &&
            setData({...data, error: error.response.msg, success: ''})
        }
    }
  return (
    <div className="fg_pass">
            <h2 style={{textAlign: 'center', margin: 40, color: 'red'}}>Reset Your Password</h2>

                {error && showErrMsg(error)}
                {success && showSuccessMsg(success)}
            <form className="forms login" style={{width: '75%', margin: '0 auto'}}>

                <label style={{width: '100%', background: 'transparent', fontSize: '18px', padding: '0'}}  htmlFor="password">Password</label>
                <input style={{height: '100%', border: 0}} autoComplete="username"  type="text"  className="form__input" required  name="password" id="password" value={password} 
            onChange={handleChangeInput} />
                <label style={{width: '100%', background: 'transparent', fontSize: '18px', padding: '0'}}  htmlFor="cf_password">Confirm Password</label>
                <input style={{height: '100%', border: 0}} autoComplete="username"  type="text"  className="form__input" required  name="cf_password" id="cf_password" value={cf_password}
            onChange={handleChangeInput} />

                <button style={{height: '45px', background: 'lightblue', transition: 'all .5s'}} onClick={(e)=>{handleResetPass(e)}}>Reset Password</button>
            </form> 
        </div>
  )
}

export default ResertPassword