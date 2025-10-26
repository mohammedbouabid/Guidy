import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import guidePlaceReducer from "./slices/guidePlaceSlice";
import packReducer from "./slices/packSlice";
import bookingReducer from "./slices/bookingSlice";

const store = configureStore({
  reducer: {
    Auth: authReducer,
    guidePlace: guidePlaceReducer,
    pack: packReducer,
    booking: bookingReducer,
  },
});

export default store;
