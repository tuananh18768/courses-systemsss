import ACTIONS from './index'
import axios from 'axios'

export const fetchDetailPost = async(id, token) => {
    const res = await axios.get(`/api/get_idea/${id}`, { headers: { Authorization: token } })
    return res
}
export const dispatchGetDetailPost = (res) => {
    return {
        type: ACTIONS.GET_IDEA,
        payload: res.data
    }
}