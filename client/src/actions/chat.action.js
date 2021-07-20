export const SHOW_PARTICIPANTS = 'SHOW_PARTICIPANTS';
export const SHOW_CONTEXT_MENU = 'SHOW_CONTEXT_MENU';
export const SHOW_ADD_PARTICIPANT = 'SHOW_ADD_PARTICIPANT';
export const SET_MESSAGE_RECEIVER = 'SET_MESSAGE_RECEIVER';

export const showParticipants = () =>  ({ type: SHOW_PARTICIPANTS });
export const showContextMenu = () => ({type: SHOW_CONTEXT_MENU});
export const showAddParticipant = () => ({type:SHOW_ADD_PARTICIPANT});
export const setMessageReceiver = (receiver) => ({type:SET_MESSAGE_RECEIVER, payload:{receiver}})
