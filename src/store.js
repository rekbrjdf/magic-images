import { configureStore, createSlice } from '@reduxjs/toolkit';
import { UserInfo } from '@vkontakte/vk-bridge';

export const INITIAL_STATE = {
  user: UserInfo,
  accountToken: '',
  profilePanelEventId: null,
};

// type Payload = {
//   payload: Partial<mainReducerProps>,
//   type: string,
// };

const mainReducer = createSlice({
  name: 'main',
  initialState: INITIAL_STATE,
  reducers: {
    set: (state, action) => ({ ...state, ...action.payload }),
  },
});

const store = configureStore({
  reducer: {
    main: mainReducer.reducer,
  },
});

export const { set } = mainReducer.actions;
export default store;
