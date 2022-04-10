import ACTIONS from './index'
import axios from 'axios'

export const fetchIdeaOfStaff = async(token) => {
    const res = await axios.get('/api/get_allIdeaStaff', { headers: { Authorization: token } })
    return res
}
export const dispatchIdeaOfStaff = (res) => {
    return {
        type: ACTIONS.IDEALL_STAFF,
        payload: res.data
    }
}