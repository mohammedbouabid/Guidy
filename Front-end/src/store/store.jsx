import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import guidePlaceReducer from "./slices/guidePlaceSlice";

const store = configureStore({
  reducer: {
    Auth: authReducer,
    guidePlace: guidePlaceReducer,
  },
});

export default store;
