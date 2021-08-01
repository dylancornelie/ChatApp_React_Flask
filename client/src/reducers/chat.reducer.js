import {
  ADD_PARTICIPANT,
  JOIN_CHAT,
  REMOVE_PARTICIPANT,
  SET_MESSAGE_RECEIVER,
  SHOW_ADD_PARTICIPANT,
  SHOW_CONTEXT_MENU,
  SHOW_PARTICIPANTS,
} from '../actions/chat.action';

const initialState = {
  showParticipants: false,
  showContextMenu: false,
  showAddParticipant: false,
  messageReceiver: '',
  meetingInfo: null,
};

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case JOIN_CHAT:
      return { initialState, meetingInfo: action.payload.meeting };
    case SHOW_PARTICIPANTS:
      return { ...state, showParticipants: !state.showParticipants };
    case SHOW_CONTEXT_MENU:
      return { ...state, showContextMenu: !state.showContextMenu };
    case SHOW_ADD_PARTICIPANT:
      return { ...state, showAddParticipant: !state.showAddParticipant };
    case SET_MESSAGE_RECEIVER:
      return { ...state, messageReceiver: action.payload.receiver };
    case ADD_PARTICIPANT:
      console.log('ajout dans chat reducer');
      return { ...state };
    case REMOVE_PARTICIPANT:
      console.log('retrait d un participant');
      return { ...state };
    default:
      return state;
  }
}
