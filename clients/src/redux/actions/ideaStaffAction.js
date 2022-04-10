import ACTIONS from './index'
import axios from 'axios'

export const fetchAllIdeaStaff = async(token) => {
    const res = await axios.get('/api/getall_idea', { headers: { Authorization: token } })
    return res
}
export const dispatchGetAllIdeaStaff = (res) => {
    return {
        type: ACTIONS.GET_ALL_IDEA_STAFF,
        payload: res.data
    }
}