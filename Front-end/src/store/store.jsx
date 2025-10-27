import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import usersReducer from "./slices/usersSlice";

import guidePlaceReducer from "./slices/guidePlaceSlice";
import packReducer from "./slices/packSlice";
import bookingReducer from "./slices/bookingSlice";

const store = configureStore({
  reducer: {
    Auth: authReducer,
    users: usersReducer,
    guidePlace: guidePlaceReducer,
    pack: packReducer,
    booking: bookingReducer,
  },
});

export default store;
