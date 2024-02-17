import { configureStore } from '@reduxjs/toolkit';
import imagesReducer from './reducers/imagesSlice'; // Подставьте путь к вашему редьюсеру

const store = configureStore({
  reducer: {
    images: imagesReducer,
  },
});

export default store;
