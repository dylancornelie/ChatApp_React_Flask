import {
  ADD_USER_CONNECTED,
  DESIGNATE_COACH,
  FETCH_MESSAGES,
  FETCH_MORE_MESSAGES,
  JOIN_CHAT,
  REFRESH_MEETING_DATA,
  REMOVE_PRIVILEGES,
  REMOVE_USER_CONNECTED,
  SCROLLED_TO_BOTTOM,
  SEND_MESSAGE,
  SET_MESSAGE_RECEIVER,
  SHOW_ADD_PARTICIPANT,
  SHOW_CONTEXT_MENU,
  SHOW_PARTICIPANTS,
  SHOW_PREPARED_MESSAGE,
  STOP_FETCH_MORE_MESSAGES,
} from '../actions/chat.action';

const initialState = {
  showParticipants: false,
  showContextMenu: false,
  showAddParticipant: false,
  targetedUser: {},
  targetedUserIsCoach: false,
  messageReceiver: {},
  meeting: {},
  messages: [],
  hasNext: { hasNext: false, linkToNext: '' },
  toScroll: true,
  showPreparedMessage: false,
  canFetchMoreMessage: false,
  userConnected: []
};

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case JOIN_CHAT:
      return { initialState, meeting: action.payload.meeting, userConnected:[] };
    case SHOW_PARTICIPANTS:
      return { ...state, showParticipants: !state.showParticipants };
    case SHOW_CONTEXT_MENU:
      return {
        ...state,
        showContextMenu: !state.showContextMenu,
        targetedUser: action.payload.targetedUser,
        targetedUserIsCoach: action.payload.targetedUserIsCoach,
      };
    case SHOW_ADD_PARTICIPANT:
      return { ...state, showAddParticipant: !state.showAddParticipant };
    case SET_MESSAGE_RECEIVER:
      return { ...state, messageReceiver: action.payload.receiver };
    case DESIGNATE_COACH:
      state.meeting.coaches.push(action.payload.newCoach);
      state.meeting.participants = state.meeting.participants.filter(
        (participant) => participant.id !== action.payload.newCoach.id
      );
      return { ...state };
    case REMOVE_PRIVILEGES:
      state.meeting.participants.push(action.payload.oldCoach);
      state.meeting.coaches = state.meeting.coaches.filter(
        (coach) => coach.id !== action.payload.oldCoach.id
      );
      return { ...state };
    case FETCH_MESSAGES:
      const hasNext = {
        hasNext: action.payload.data.has_next,
        linkToNext: action.payload.data.next,
      };
      return {
        ...state,
        messages: action.payload.data.data,
        hasNext: { ...hasNext },
        toScroll: true,
        canFetchMoreMessage: true,
      };
    case FETCH_MORE_MESSAGES:
      const newHasNext = {
        hasNext: action.payload.data.has_next,
        linkToNext: action.payload.data.next,
      };
      state.messages = [...state.messages, ...action.payload.data.data];
      return {
        ...state,
        canFetchMoreMessage: true,
        hasNext: { ...newHasNext },
      };
    case REFRESH_MEETING_DATA:
      return { ...state, meeting: action.payload.newMeetingData };
    case SEND_MESSAGE:
      state.messages.unshift(action.payload.message);
      return { ...state, toScroll: true };
    case SCROLLED_TO_BOTTOM:
      return { ...state, toScroll: false };
    case SHOW_PREPARED_MESSAGE:
      return { ...state, showPreparedMessage: !state.showPreparedMessage };
    case STOP_FETCH_MORE_MESSAGES:
      return { ...state, canFetchMoreMessage: false };
    case ADD_USER_CONNECTED:
      return {...state, userConnected: [...new Set([...state.userConnected, ...action.payload.userId ])]}
    case REMOVE_USER_CONNECTED:
      return {...state, userConnected: state.userConnected.filter(user => user !== action.payload.userId)}
    default:
      return { ...state };
  }
}
