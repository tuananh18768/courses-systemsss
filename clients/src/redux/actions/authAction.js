import ACTIONS from './index'
import axios from 'axios'
export const dispatchLogin = () => {
    return {
        type: ACTIONS.LOGIN
    }
}
export const fetchUser = async(token) => {
    const res = await axios.get('/user/infor', { headers: { Authorization: token } })
    return res
}
export const fetchAvatar = async(token) => {
    const res = await axios.get('/api/get_avatar', { headers: { Authorization: token } })
    return res
}
export const dispatchGetUser = (res) => {
    return {
        type: ACTIONS.GET_USER,
        payload: {
            user: res.data,
            isAdmin: res.data.role === 1 ? true : false,
            isManager: res.data.role === 2 ? true : false,
            isCoordinator: res.data.role === 3 ? true : false,
            isUSer: res.data.role === 0 ? true : false,
        }
    }
}
export const dispatchGetAvatar = (res) => {
    return {
        type: ACTIONS.GET_AVATAR,
        payload: res.data
    }
}