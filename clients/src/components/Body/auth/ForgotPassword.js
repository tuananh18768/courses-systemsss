import React, { useState } from 'react'
import axios from 'axios'
import {isEmail} from '../../utils/validation/validation'
import {showErrMsg, showSuccessMsg} from '../../utils/Notification/Notification'

const initialState = {
    email: '',
    error: '',
    success: '',
}
function ForgotPassword() {
    const [data, setData] = useState(initialState)
    const {email, error, success} = data
    
    const handleChangeInput = (e)=>{
        const {name, value} = e.target
        setData({
            ...data,
            [name]: value,
            error: '',
            success: '',
        })
        console.log(data)
    }
    const forgotPassword = async (e) =>{
        e.preventDefault()
        if(!isEmail(email)){
            return setData({...data, error: 'Invalid email', success: ''})
        }
        try {
            const res = await axios.post('/user/forgot', {email})
            return setData({...data, error: '', success: res.data.msg})
        } catch (error) {
            error.response.data.msg &&  
             setData({...data, error: error.response.data.msg, success: ''})
        }
    }
  return (
    <div className="fg_pass">
        <h2 style={{textAlign: 'center', margin: 40, color: 'red'}}>Forgot your Password?</h2>
            {error && showErrMsg(error)}
            {success && showSuccessMsg(success)}
        <form className="forms login" style={{width: '75%', margin: '0 auto'}}>
            <label style={{width: '100%', background: 'transparent', fontSize: '18px', padding: '0'}} htmlFor="email">Enter your email address</label>
            <input style={{height: '100%', border: 0}} autoComplete="username"  type="text"  className="form__input" placeholder="Email" required  id="email" name="email" value={email}  
            onChange={(e)=>{handleChangeInput(e)}} />
            <button id="btnForgot" style={{height: '45px', background: 'lightblue', transition: 'all .5s'}} onClick={(e)=>{forgotPassword(e)}}>Verify your email</button>
        </form>
    </div>
  )
}

export default ForgotPassword