import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'
import {fetchAvatar, dispatchGetAvatar} from '../../redux/actions/authAction'

export default function Header() {
 
    const auth = useSelector(state => state.auth)
    const token = useSelector((state) => state.token);
    const dispatch = useDispatch()
    const {user, isLogged, isAdmin, getAvatar} = auth
    const handleLogout = async ()=>{
      try {
          await axios.get('/user/logout')
          localStorage.removeItem('firstLogin')
          window.location.href ='/'
      } catch (error) {
          window.location.href= "/"
      }
    }
    useEffect( ()=>{
      if(token){
          fetchAvatar(token).then(res =>(dispatch(dispatchGetAvatar(res))))
      }
  }, [token, dispatch])
    const userLink = () =>{
      return  <li className="drop-nav">
            <Link to='/' className="avatar">
              <img  src={getAvatar?.filePath ? getAvatar?.filePath : user.avatar} alt="" style={{width:50, height:50, borderRadius: '50%', display: 'inline', objectFit: 'cover'}} /> {user.name}<i className="fa-solid fa-angle-down"></i>
            </Link>
          <ul className="dropdown" style={{zIndex: 100}}>
                <li><Link to={isAdmin ? `/profileAdmin` :  `/profile`}>Profile</Link></li>
                <li><Link to='/' onClick={()=>{handleLogout()}}>Logout</Link></li>
            </ul>
      </li>
    }
  return (
    <header className="header">
            <div className="header__content" style={{padding: '10px'}}>
                <div className="header__logo">
                    <Link style={{display: 'flex', justifyContent: 'space-between', gap: '14px', margin: '10px'}}to="/"><img src="../img/logo.jpg" alt="logo" className="header__img" /> Courses Sytems </Link>
                </div>
                <div className="header__login">
                <ul style={{margin: 0}}>
                {
                    isLogged
                    ? userLink()
                    : <button className="btn btn-primary"><Link to="/login"  style={{color: 'white'}}><i className="fa fa-user"></i> Sign In</Link></button>
                  }
                </ul>
                </div>
            </div>
        </header>
  )
}
