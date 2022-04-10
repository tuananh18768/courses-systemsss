import React, { useEffect, useState } from "react";
// import style from './profile.module.css'
import {fetchAllUsers, dispatchGetAllUsers} from '../../../redux/actions/userAction'
import axios from "axios";
import {
    showErrMsg,
    showSuccessMsg,
} from "../../utils/Notification/Notification";
import { isPassword, isCf_pass } from "../../utils/validation/validation";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {fetchAvatar, dispatchGetAvatar} from '../../../redux/actions/authAction'


const initialState = {
    name: "",
    password: "",
    cf_password: "",
    err: "",
    success: "",
};

export default function Profile() {
    const auth = useSelector((state) => state.auth);
    const token = useSelector((state) => state.token);
    const users = useSelector((state) => state.users);

    const { user, isAdmin, isManager, getAvatar } = auth;
    const [data, setData] = useState(initialState);
    const [avatar, setAvatar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [callback, setCallback] = useState(false);
    const [date, setDate] = useState(Date.now())
    
    const dispatch = useDispatch()
    
    const { name, password, cf_password, err, success } = data;
    useEffect( ()=>{
        if(isAdmin){
            fetchAllUsers(token).then(res =>(dispatch(dispatchGetAllUsers(res))))
        }
    }, [token, isAdmin, dispatch, callback])
    useEffect( ()=>{
        if(token){
            fetchAvatar(token).then(res =>(dispatch(dispatchGetAvatar(res))))
        }
    }, [token, dispatch, callback, date])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value, err: '', success: '' })
    }
    const updateInfor = () => {
        try {
            axios.patch('/user/update_infor', {
                name: name ? name : user.name,
            }, {
                headers: { Authorization: token }
            })
            setData({ ...data, err: '', success: 'Update success' })
        } catch (error) {
            setData({ ...data, err: error.response.data.msg, success: '' })
        }
    }
    const updatePassword = () => {
        if (!isPassword(password)) {
            return setData({ ...data, err: 'Password must be at least 6 characters', success: '' })
        }
        if (!isCf_pass(password, cf_password)) {
            return setData({ ...data, err: 'Password is not match!!', success: '' })
        }
        try {
            axios.post('/user/reset', { password }, 
            { headers: { Authorization: token } })
            setData({ ...data, err: '', success: 'Update success' })
        } catch (error) {
            setData({ ...data, err: error.response.data.msg, success: '' })
        }
    }
    const handleUpdate = () => {
        if (name) updateInfor()
        if (password) updatePassword()
    }
    const changeAvatar = async(e)=>{
        e.preventDefault()
        try {
            const file = e.target.files[0]
            console.log(file)
            if(!file) return  setData({ ...data, err: 'not file upload', success: '' })
            if (file.size > 1024 * 1024) {
                return setData({ ...data, err: 'Size to large', success: '' })
            }
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                return setData({ ...data, err: 'file is not format', success: '' })
            }
            let formData = new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/avater_upload', formData, {
                headers: { 'contetn-type': 'multipart/form-data', Authorization: token }
            })
            setLoading(false)
            setAvatar(res.data.url)
            setDate(Date.now())
        } catch (error) {
            setData({ ...data, err: error.response.data.msg, success: '' })
        }
    }
    const handleRemove = async (id)=>{
        try {
            if(user._id === id){
                if(window.confirm('Are you sure you want to delete this account?')){
                    setLoading(true)
                    await axios.delete(`/user/delete_user/${id}`, { headers: { Authorization: token }})
                    setLoading(false)
                    setCallback(!callback)
                }
            }
        } catch (err) {
            setData({...data, err: err.response.data.msg, success:''})
        }
    }
    const renderData = () =>{
        return users.map((current, index) =>{
            return <tr key={index}>
            <td>{index}</td>
            <td>{current.name}</td>
            <td>{current.email}</td>
            <td>
                {
                    current.role === 1 ? <i className="fas fa-check" title="Admin"></i>
                    : <i className="fas fa-times" title="User"></i>
                }
            </td>
            <td>
                <Link to={`/edit_user/${current._id}`}>
                    <i className="fas fa-edit" title="Edit"></i>
                </Link>
                <i className="fas fa-trash-alt" title="Remove" style={{cursor: 'pointer', marginLeft: 30}} onClick={()=>{handleRemove(current._id)}}></i>
            </td>
        </tr>
        })
    }

     const linkImage = getAvatar ? `https://courses-systems.herokuapp.com/${getAvatar?.filePath}` :  user.avatar
    return (
      <>
        <div>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            {loading && <h3>Loadding ....</h3>}
        </div>
            <div className="body">
            <div className="wraper_profile">
                <div className="wraper_profile_left">
                    <div className="wraper_profile_left_all">
                        <h2>{isAdmin ? "Admin Profile" : "User Profile"}</h2>
                        <div className="parent__file" style={{position: "relative", overflow: "hidden", borderRadius: '50%'}}>
                            <img
                                className="img_profile"
                                // src={avatar ? avatar : user.avatar}
                                src={linkImage}
                                width="200px"
                                height="200px"
                                alt="helo"
                            />
                            <div className="span__chooseFile">
                                <i className="fa fa-camera-retro"></i>
                                <p style={{margin: 0}}>Change</p>
                                <input type="file" name="file" id="file_up" onChange={changeAvatar} />
                            </div>
                        </div>
                        <div>
                            <h3>{user.name}</h3>
                            <p>{user.email}</p>
                        </div>
                    </div>
                </div>
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
                            defaultValue={user.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Email address"
                            defaultValue={user.email}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">New password</label>
                        <input
                            type="pass"
                            name="password"
                            id="password"
                            placeholder="New password address"
                            value={password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cf_password">Confirm password</label>
                        <input
                            type="pass"
                            name="cf_password"
                            id="cf_password"
                            placeholder="Confirm password address"
                            value={cf_password}
                            onChange={handleChange}
                        />
                    </div>
                    <button disabled={loading} onClick={handleUpdate} className="wraper_profile_submit">
                        Update
                    </button>
                </div>

                <div className="wraper_profile_right">
                    <div className="div_btn">
                        <button><Link to="/">Go view home</Link></button>
                        {isManager ?<button><Link to="/managerIdea">Manager category</Link></button>: <button><Link to="/managerIdea">Manager idea</Link></button>}
                    </div>
                </div>
            </div>
            {isAdmin &&  <table className="customers table table-dark mt-5">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {renderData()}
                </tbody>
            </table>}
           
        </div>
      </>
    );
}
