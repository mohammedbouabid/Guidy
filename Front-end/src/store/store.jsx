import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import usersReducer from "./slices/usersSlice";
import guidePlaceReducer from "./slices/guidePlaceSlice";


const store = configureStore({
  reducer: {
    Auth: authReducer,
    users: usersReducer,
    guidePlace: guidePlaceReducer,
  },
});
export default store;
