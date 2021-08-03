import {
  DESIGNATE_COACH,
  FETCH_MESSAGES,
  JOIN_CHAT,
  REMOVE_PRIVILEGES,
  SET_MESSAGE_RECEIVER,
  SHOW_ADD_PARTICIPANT,
  SHOW_CONTEXT_MENU,
  SHOW_PARTICIPANTS,
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
};

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case JOIN_CHAT:
      return { initialState, meeting: action.payload.meeting };
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
      const newHasNext = {
        hasNext: action.payload.data.has_next,
        linkToNext: action.payload.data.next,
      };
      return {
        ...state,
        messages: action.payload.data.data,
        hasNext: { ...newHasNext },
      };
    default:
      return state;
  }
}
