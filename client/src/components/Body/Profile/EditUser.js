import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import {showErrMsg, showSuccessMsg} from '../../utils/Notification/Notification'

function EditUser() {
    const  {id} = useParams()
    const history = useHistory()
    const [editUser, setEditUser] = useState([])

    const users = useSelector(state => state.users)
    const token = useSelector(state => state.token)

    const [checkAdmin, setCheckAdmin] = useState(false)
    const [err, setErr] = useState(false)
    const [success, setSuccess] = useState(false)
    const [num, setNum] = useState(0)

    useEffect(()=>{
        if(users.length !== 0){
            users.forEach(user =>{
                if(user._id === id){
                    setEditUser(user)
                    setCheckAdmin(user.role === 1 ? true : false)
                }
            })
        }else{
            history.push('/profile')
        }
    }, [users, id, history])
    const handleUpdate = async ()=>{
        try {
            if(num % 2 !== 0){
                const res = await axios.patch(`/user/update_role/${editUser._id}`,{
                    role: checkAdmin ? 1 :  0
                }, {
                    headers: {Authorization: token }, 
                })
                setSuccess(res.data.msg)
                setNum(0)
            }
        } catch (err) {
            return err.response.data.msg && setErr(err.response.data.msg)
        }
    }

    const handleCheck = ()=>{
        setSuccess('')
        setErr('')
        setCheckAdmin(!checkAdmin)
        setNum(num + 1)
    }
    return (
        <div className="body">
        <div className="row">
            <button onClick={()=>{history.goBack()}} className="btn btn-primary" style={{marginLeft: 40}}>
                <i className="fas fa-long-arrow-alt-left"></i> Go Back
            </button>
        </div>
        <div className="wraper_profile edit_user">
            <div className="wraper_profile_middle">
                <h1 className="wraper_profile_heading">Basic Information</h1>
                <hr width="500px" style={{ marginLeft: 100 }} />
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Your name"
                        defaultValue={editUser.name}
              
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Email address"
                        defaultValue={editUser.email}
                        disabled
                    />
                </div>

                <div className="form-group">
                    <input
                        type="checkbox"
                        id="Admin"
                        checked={checkAdmin}
                        onChange={handleCheck}
                    />
                    <label htmlFor="isAdmin">isAdmin</label>
                </div>
              
                <button onClick={handleUpdate} className="wraper_profile_submit">
                    Update
                </button>
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}
            </div>

           
        </div>
    </div>
  )
}

export default EditUser