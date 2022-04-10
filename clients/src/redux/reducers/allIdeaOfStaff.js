import ACTIONS from '../actions/index'

const allIdea = []

const allIdaOfStaff = (state = allIdea, action) => {
    switch (action.type) {
        case ACTIONS.IDEALL_STAFF:
            {

                return action.payload
            }
        default:
            {
                return state
            }
    }
}

export default allIdaOfStaff