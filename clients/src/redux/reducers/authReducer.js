import ACTIONS from '../actions/index'

const initialState = {
    user: [],
    isLogged: false,
    isAdmin: false,
    isManager: false,
    isCoordinator: false,
    isUSer: false,
    getAvatar: {}
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.LOGIN:
            {
                return {
                    ...state,
                    isLogged: true,
                }
            }
        case ACTIONS.GET_USER:
            {
                return {
                    ...state,
                    user: action.payload.user,
                    isAdmin: action.payload.isAdmin,
                    isManager: action.payload.isManager,
                    isCoordinator: action.payload.isCoordinator,
                    isUSer: action.payload.isUSer
                }
            }
        case ACTIONS.GET_AVATAR:
            {
                return {
                    ...state,
                    getAvatar: action.payload
                }
            }
        default:
            {
                return state;
            }
    }
}
export default authReducer