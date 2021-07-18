import { SHOW_CONTEXT_MENU, SHOW_PARTICIPANTS } from '../actions/chat.action';

const initialState = { showParticipants: false, showContextMenu: false };

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_PARTICIPANTS:
      return {...state,
      showParticipants: !state.showParticipants};
    case SHOW_CONTEXT_MENU:
      return {...state,
      showContextMenu: !state.showContextMenu}
    default:
      return state;
  }
}
