import {
  ACCOUNT_DATA_CHANGE,
  DISCONNECT_USER,
  GET_USER,
  SIGN_IN_USER,
  SIGN_UP_USER,
} from '../actions/user.action';

const initialState = {
  signInError: '',
  signUpError: '',
  changePasswordError: '',
  user: {},
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_UP_USER:
      return {
        ...state,
        signUpError: action.payload.signUpError,
      };
    case SIGN_IN_USER:
      return {
        ...state,
        signInError: action.payload.signInError,
      };
    case GET_USER:
      return {
        ...state,
        user: {
          id: action.payload.user.id,
          email: action.payload.user.email,
          login: action.payload.user.username,
          firstName: action.payload.user.first_name,
          lastName: action.payload.user.last_name,          
        },
      };
    case ACCOUNT_DATA_CHANGE:
      return {
        ...state,
        user: {
          id: action.payload.id,
          email: action.payload.email,
          login: action.payload.username,
          firstName: action.payload.first_name,
          lastName: action.payload.last_name,
        },
      }
    case DISCONNECT_USER:
      return { initialState };
    default:
      return state;
  }
}
