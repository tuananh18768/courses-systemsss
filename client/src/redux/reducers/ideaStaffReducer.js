import ACTIONS from "../actions/index";

const ideaSaff = [];

const ideaStaffReducer = (state = ideaSaff, action) => {
    switch (action.type) {
        case ACTIONS.GET_ALL_IDEA_STAFF:
            {
                console.log(action.payload);
                return action.payload;
            }
        default:
            {
                return state;
            }
    }
};

export default ideaStaffReducer;