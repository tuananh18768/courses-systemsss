import ACTIONS from '../actions/index'

const postDetail = {}

const detailPostReducer = (state = postDetail, action) => {
    switch (action.type) {
        case ACTIONS.GET_IDEA:
            {

                return action.payload
            }
        default:
            {
                return state
            }
    }
}

export default detailPostReducer