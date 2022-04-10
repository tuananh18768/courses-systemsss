import ACTIONS from '../actions/index'

const catergory = []

const categoryReducer = (state = catergory, action) => {
    switch (action.type) {
        case ACTIONS.GET_ALL_CATEGORY:
            {
                return action.payload
            }
        default:
            {
                return state
            }
    }
}
export default categoryReducer