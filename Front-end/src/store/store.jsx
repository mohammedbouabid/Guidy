import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import guidePlaceReducer from "./slices/guidePlaceSlice";
import packReducer from "./slices/packSlice";

const store = configureStore({
  reducer: {
    Auth: authReducer,
    guidePlace: guidePlaceReducer,
    pack: packReducer,
  },
});

export default store;
