import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import {showErrMsg, showSuccessMsg} from '../../utils/Notification/Notification'
function ActivationEmail() {
    const {activation_token} = useParams('')
    const [err, setErr] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(()=>{
        if(activation_token){
            const activationEmails = async ()=>{
                try {
                    const res = await axios.post('http://localhost:5000/user/activation', {activation_token})
                    setSuccess(res.data.msg)
                    console.log(res)
                } catch (err) {
                    err.response.data.msg && setErr(err.response.data.msg)
                }
            }
            activationEmails()
        }
    }, [activation_token])
    console.log(useParams())
  return (
    <div>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
    </div>
  )
}

export default ActivationEmail