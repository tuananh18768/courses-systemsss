import React, { useEffect } from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import Header from './components/Header/Header'
import Body from './components/Body/Body'
import axios from 'axios'
import ACTIONS from './redux/actions/index'
import {dispatchLogin, fetchUser, dispatchGetUser} from './redux/actions/authAction'
// import Footer from './components/Footer/Footer'

export default function App() {
  const dispatch = useDispatch()
  const token = useSelector(state => state.token)
  const auth = useSelector(state => state.auth)

  useEffect(()=>{
      const firstLogin = localStorage.getItem('firstLogin')
      if(firstLogin){
        const getToken = async ()=>{
            const res = await axios.post('/user/refresh_token', null)
            dispatch({type: ACTIONS.GET_TOKEN, payload: res.data.access_token})
        }
        getToken()
      }
  }, [auth.isLogged, dispatch])

  useEffect(()=>{
    if(token){
      const getUser = ()=>{
        dispatch(dispatchLogin())
        return fetchUser(token).then(res =>{
          dispatch(dispatchGetUser(res))
        })
      }
      getUser()
    }
  },[token, dispatch])
  return (
    <Router>
      <div className="App">
            <Header />
            <Body />
            {/* <Footer /> */}
      </div>
    </Router>
  )
}
