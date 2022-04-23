import ACTIONS from './index'
import axios from 'axios'

export const fetchAllCategory = async(token) => {
    const res = await axios.get('/user/getAll_category', { headers: { Authorization: token } })
    return res
}
export const dispatchGetAllCategory = (res) => {
    return {
        type: ACTIONS.GET_ALL_CATEGORY,
        payload: res.data
    }
}