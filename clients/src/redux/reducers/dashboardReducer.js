import ACTIONS from '../actions/index'

const dashboard = []

const categoryReducer = (state = dashboard, action) => {
    switch (action.type) {
        case ACTIONS.DASH_BOARD:
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