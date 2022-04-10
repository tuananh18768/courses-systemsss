import ACTIONS from '../actions/index'

const department = {
    departmentAlls: [],
    departmentOne: []
}

const departmentReducer = (state = department, action) => {
    switch (action.type) {
        case ACTIONS.GET_ALL_DEPARTMENT:
            {
                return {
                    ...state,
                    departmentAlls: action.payload
                }
            }
        case ACTIONS.GET_ONE_DEPARTMENT:
            {
                return {
                    ...state,
                    departmentOne: action.payload
                }
            }
        default:
            {
                return state
            }
    }
}
export default departmentReducer