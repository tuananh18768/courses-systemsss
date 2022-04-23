import ACTIONS from './index'
import axios from 'axios'

export const fetchAllDepartment = async(token) => {
    const res = await axios.get('/user/get_allDeparment', { headers: { Authorization: token } })
    return res
}
export const fetchOneDepartment = async(id, token) => {
    const res = await axios.get(`/user/get_departmentOne/${id}`, { headers: { Authorization: token } })
    return res
}
export const dispatchGetAllDepartment = (res) => {
    return {
        type: ACTIONS.GET_ALL_DEPARTMENT,
        payload: res.data
    }
}
export const dispatchGetOneDepartment = (res) => {
    return {
        type: ACTIONS.GET_ONE_DEPARTMENT,
        payload: res.data
    }
}