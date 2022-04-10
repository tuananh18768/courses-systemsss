import ACTIONS from './index'
import axios from 'axios'

export const fetchDashboard = async(token) => {
    const res = await axios.get('/user/dashboard', { headers: { Authorization: token } })
    return res
}
export const dispatchDashboard = (res) => {
    return {
        type: ACTIONS.DASH_BOARD,
        payload: res.data
    }
}