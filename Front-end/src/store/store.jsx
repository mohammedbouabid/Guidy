import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import usersReducer from "./slices/usersSlice";


const store = configureStore({
  reducer: {
    Auth: authReducer,
    users: usersReducer,
  },
});
export default store;
