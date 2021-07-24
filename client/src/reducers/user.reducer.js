import { SIGN_UP_USER } from '../actions/user.action';

const initialState = {
  signInError: '',
  signUpError: '',
  changePasswordError: '',
  userToken: '',
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_UP_USER:
      return {
        ...state,
        userToken: action.payload.userToken,
        signUpError: action.payload.signUperror,
      };
    default:
      return state;
  }
}
