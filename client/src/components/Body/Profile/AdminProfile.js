import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import axios from "axios";
import { isPassword, isCf_pass } from "../../utils/validation/validation"
import {showErrMsg, showSuccessMsg} from "../../utils/Notification/Notification"
import {fetchAvatar, dispatchGetAvatar} from '../../../redux/actions/authAction'

const formAdmin = {
    padding: "0",
    border: "0",
    borderRadius: "0",
    backgroundColor: "transparent",
}

const initialState = {
    name: "",
    password: "",
    cf_password: "",
    err: "",
    success: "",
};

export default function AdminProfile() {

    const auth = useSelector((state) => state.auth);
    const token = useSelector((state) => state.token);

    const { user, getAvatar} = auth;
    const [data, setData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [callback, setCallback] = useState(false);
    const [date, setDate] = useState(Date.now())

    const dispatch = useDispatch()
    const { name, password, cf_password, err, success } = data;

    const handleChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value, err: '', success: '' })
    }
    useEffect( ()=>{
        if(token){
            fetchAvatar(token).then(res =>(dispatch(dispatchGetAvatar(res))))
        }
    }, [token, dispatch, callback, date])
    const updateInfor = () => {
        try {
            axios.patch('/user/update_infor', {
                name: name ? name : user.name
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
        if (name ) updateInfor()
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
             await axios.post('/api/avater_upload', formData, {
                headers: { 'contetn-type': 'multipart/form-data', Authorization: token }
            })
            setLoading(false)
            setDate(Date.now())
        } catch (error) {
            setData({ ...data, err: error.response.data.msg, success: '' })
        }
    }
    const linkImage = getAvatar ? `https://courses-systems.herokuapp.com/${getAvatar?.filePath}` :  user.avatar
    return (
        <div className="adwrap">
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            {loading && <h3>Loadding ....</h3>}
            <div className="adwrap__header">
                <h1>Admin Profile</h1>
                <Link style={{color: 'blue'}} to="/home">Home </Link><i className="fa-solid fa-arrow-right-long" /><span> Admin Profile</span>
            </div>
            <div className="adwrap__content">
                <div className="adwrap__content__col1">
                    <div className="adwrap__content__col__box">
                        <h2 className="ad__mb">General Infomation</h2>
                        <form action style={formAdmin}>
                            <div className="col1__inputg ad__mb">
                                <div className="col1__inputg__icon">
                                    <i className="fa-solid fa-user" />
                                </div>
                                <div className="col1__inputg__input">
                                    <label htmlFor="name">Name</label>
                                    <input style={{borderRadius: 0}} type="text" name="name" id="name" onChange={handleChange} defaultValue={user.name} />
                                </div>
                            </div>
                            <div className="col1__inputg ad__mb">
                                <div className="col1__inputg__icon em">
                                    <i className="fa-solid fa-envelope" />
                                </div>
                                <div className="col1__inputg__input">
                                    <label htmlFor="email">Email</label>
                                    <input style={{borderRadius: 0}} disabled type="text" name="email" onChange={handleChange} defaultValue={user.email} />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="adwrap__content__col__box">
                        <h2 className="ad__mb">Change password</h2>
                        <form action style={formAdmin}>
                            <div className="col1__inputg ad__mb">
                                <div className="col1__inputg__input">
                                    <label htmlFor="competence">New password</label>
                                    <input style={{borderRadius: 0}} type="text"   name="password" placeholder="New password address" value={password}
                            onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col1__inputg ad__mb">
                                <div className="col1__inputg__input">
                                    <label htmlFor="email">Confirm Password</label>
                                    <input  style={{borderRadius: 0}} type="text"  name="cf_password"  placeholder="Confirm password address"
                                    value={cf_password}
                                    onChange={handleChange} />
                                </div>
                            </div>
                            <div className="ad__div__btn">
                                <button disabled={loading} className="ad_btn" onClick={handleUpdate}>Update</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="adwrap__content__col2">
                    <div className="adwrap__content__col__box">
                        <div className="ad__img my-2">
                            <img className="ad_img_content"   src={linkImage === ''? user.avatar : linkImage} width="200px" alt="backgournd" />
                            <div className="span__chooseFile" >
                                <i className="fa fa-camera-retro"></i>
                                <p style={{margin: 0}}>Change</p>
                                <input type="file" name="file" id="file_up" onChange={changeAvatar} />
                            </div>
                        </div>
                        <h3>Admin: {user.name}</h3>
                        <p>{user.email}</p>
                        <div className="managerAll mt-4 my-4">
                            <Link to="/managerStaff" className="manager">Manger Staff</Link>
                            <Link to="/managerCoordinator" className="manager">Manger Coordinator</Link>
                            <Link to="/managerManger" className="manager">Manger Manager</Link>
                        </div>
                            <Link to="/adminManager" className="manager_department">Manger Deparment</Link>
                    </div>
                </div>
            </div>
        </div>

    )
}
