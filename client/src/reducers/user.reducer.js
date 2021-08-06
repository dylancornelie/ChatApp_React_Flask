import {
  ADD_PARTICIPANT,
  DELETE_MEETING,
  LEAVE_MEETING,
  REMOVE_PARTICIPANT,
} from '../actions/chat.action';
import {
  ACCOUNT_DATA_CHANGE,
  CREATE_MEETING,
  DISCONNECT_USER,
  GET_MEETINGS,
  GET_USER,
  INVITED_INTO_MEETING,
  REFRESH_TOKEN,
  SIGN_IN_USER,
  SIGN_UP_USER,
} from '../actions/user.action';
import { isEmpty } from '../utils/utils';

const initialState = {
  signInError: '',
  signUpError: '',
  changePasswordError: '',
  createMeetingError: '',
  addByLoginError: '',
  user: {},
  token: '',
  meetings: [],
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_UP_USER:
      return {
        ...state,
        signUpError: action.payload.signUpError,
        token: action.payload.token,
      };
    case SIGN_IN_USER:
      return {
        ...state,
        signInError: action.payload.signInError,
        token: action.payload.token,
      };
    case REFRESH_TOKEN:
      return {
        ...state,
        token: action.payload.token,
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
      };
    case DISCONNECT_USER:
      return { initialState };
    case GET_MEETINGS:
      return { ...state, meetings: action.payload.meetings };
    case CREATE_MEETING:
      if (!isEmpty(action.payload.newMeeting))
        state.meetings.push(action.payload.newMeeting);
      return {
        ...state,
        createMeetingError: action.payload.createMeetingError,
      };
    case ADD_PARTICIPANT:
      return {
        ...state,
        addByLoginError: action.payload.addByLoginError,
        meetings: state.meetings.map((meeting) => {
          if (meeting.id === action.payload.meetingId) {
            meeting.participants.push(action.payload.newUser);
          }
          return meeting;
        }),
      };
    case REMOVE_PARTICIPANT:
      return {
        ...state,
        meetings: state.meetings.map((meeting) => {
          if (meeting.id === action.payload.meetingId)
            meeting.participants = meeting.participants.filter(
              (participant) => participant.id !== action.payload.userIdToRemove
            );
          return meeting;
        }),
      };

    case DELETE_MEETING:
      return {
        ...state,
        meetings: state.meetings.filter(
          (meeting) => meeting.id !== action.payload.meetingId
        ),
      };
    case LEAVE_MEETING:
      state.meetings = state.meetings.filter(
        (meeting) => meeting.id !== action.payload.meetingId
      );
      return {
        ...state,
      };
    case INVITED_INTO_MEETING:
      state.meetings.push(action.payload.meetingData);
      return { ...state };
    default:
      return state;
  }
}
